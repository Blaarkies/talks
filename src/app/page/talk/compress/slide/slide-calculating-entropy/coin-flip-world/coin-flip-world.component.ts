import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  b2Body,
  b2BodyDef,
  b2BodyType,
  b2CircleShape,
  b2ContactListener,
  b2Fixture,
  b2PolygonShape,
  b2StepConfig,
  b2Vec2,
  b2World,
  XY,
} from '@box2d/core';
import { b2Contact } from '@box2d/core/dist/dynamics/b2_contact';
import {
  debounceTime,
  filter,
  map,
  shareReplay,
  Subject,
} from 'rxjs';
import {
  average,
  makeNumberList,
  pairItems,
} from '../../../../../../common';
import { ButtonComponent } from '../../../../../../common/component/button/button.component';
import { ProgressComponent } from '../../../../../../common/component/progress/progress.component';

function waitABit(time = 7) {
  return new Promise(r =>
    setTimeout(() =>
      window.requestAnimationFrame(() => r(0)), time));
}

let deg90InRad = Math.PI / 2;

function fixturesFromList(fixture: b2Fixture): b2Fixture[] {
  let results = new Set<b2Fixture>();
  let queue = [fixture];
  while (queue.length) {
    let item = queue.pop();
    if (!item || results.has(item)) {
      break;
    }

    results.add(item);
    queue.push(item.GetNext?.());
  }

  return Array.from(results);
}

function polarToCardinal(angle: number, radius: number) {
  let x = Math.cos(angle) * radius;
  let y = Math.sin(angle) * radius;

  return {x, y};
}

interface ConfigInputAddFixtures {
  angle: number;
  thickness: number;
  length: number;
  vertexCount: number;
}

enum CoinFlipResult {
  heads,
  tails,
}

@Component({
  selector: 'app-coin-flip-world',
  standalone: true,
  imports: [
    ButtonComponent,
    ProgressComponent,
  ],
  templateUrl: './coin-flip-world.component.html',
  styleUrl: './coin-flip-world.component.scss',
})
export class CoinFlipWorldComponent {

  protected tau = 2 * Math.PI;
  protected coinFlipResult = CoinFlipResult;
  protected scoreList = signal<CoinFlipResult[]>([]);
  protected scoreRatio = computed(() => {
    let list = this.scoreList();
    return list.length ? average(list) : null;
  });

  private hammer = viewChild('hammer', {read: ElementRef<HTMLElement>});
  private wallGroup = viewChild('wallGroup', {read: ElementRef<HTMLElement>});
  private wallsElements = viewChildren('walls', {read: ElementRef<HTMLElement>});
  private coinElement = viewChild('coin', {read: ElementRef<SVGElement>});
  private groupElement = computed(() =>
    <SVGGElement>this.coinElement()
      .nativeElement
      .querySelector('g'));
  private polylineAElement = computed(() =>
    <SVGPolylineElement>this.coinElement()
      .nativeElement
      .querySelector('polyline:first-child'));
  private polylineBElement = computed(() =>
    <SVGPolylineElement>this.coinElement()
      .nativeElement
      .querySelector('polyline:last-child'));

  private coinBody: b2Body;
  private wallsBody: b2Body;
  private world: b2World;
  private timeStep: number;
  private stepConfig: b2StepConfig;
  private isFlipping = false;
  private scale = 1e3;

  constructor() {
    let destroyRef = inject(DestroyRef);

    let changes$ = new Subject<void>();
    let coinSleep$ = changes$.pipe(
      debounceTime(150),
      map(() => this.coinBody.GetLinearVelocity().Length()
        + Math.abs(this.coinBody.GetAngularVelocity())),
      filter(v => v < 1e-2),
      shareReplay(1),
      takeUntilDestroyed(destroyRef),
    );

    coinSleep$.subscribe(() => this.isFlipping = false);

    coinSleep$.pipe(
      map(() => {
        let tau = this.tau;
        let angle = this.coinBody.GetAngle() % tau;
        let safeAngle = angle < 0
                        ? angle + tau * Math.ceil(-angle / tau)
                        : angle;
        return safeAngle > .5 * tau
               ? CoinFlipResult.tails
               : CoinFlipResult.heads;
      }),
    )
      .subscribe(result => this.scoreList.update(l => [result, ...l]));

    effect(() => {
      if (!this.wallsElements() || !this.coinElement()) {
        return;
      }

      this.world = b2World.Create({x: 0, y: 4});

      this.wallsBody = this.createWalls();
      this.drawWalls(this.wallsBody);

      this.coinBody = this.createCoin();
      this.drawCoin(this.coinBody);

      this.stepConfig = {
        velocityIterations: 6,
        positionIterations: 2,
      };
      this.timeStep = 1 / 60;

      let listener = new b2ContactListener();
      listener.BeginContact = (contact: b2Contact) => changes$.next();
      this.world.SetContactListener(listener);

      this.renderFlip();
    });
  }

  protected resetScore() {
    this.scoreList.set([]);
  }

  protected slamHammer() {
    let element = this.hammer()?.nativeElement;
    if (!element) {
      return;
    }

    element.animate([
      {rotate: '0deg'},
      {offset: .1, rotate: '50deg'},
      {offset: .9, rotate: '0deg'},
    ], {duration: 500, easing: 'ease-in'});

    setTimeout(() => {
      this.flipCoin();
      this.wallGroup().nativeElement.animate({rotate: '5deg'},
        {
          duration: 100, easing: 'ease-out',
          iterations: 2, direction: 'alternate',
        });
    }, 500 * .25);
  }

  protected foldCoin(target: EventTarget) {
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    let angle = parseFloat(target.value);

    let body = this.coinBody;
    fixturesFromList(body.GetFixtureList())
      .forEach(f => body.DestroyFixture(f));

    this.addFixtures(body, {angle});
    this.coinBody.SetTransformVec({x: 1, y: 1}, 0);
    this.drawCoin(body);

    this.resetScore();
  }


  private async renderFlip() {
    if (this.isFlipping) {
      return;
    }

    this.isFlipping = true;
    let foldyCoinElement = this.coinElement().nativeElement;

    for (let i = 0; i < 5000; ++i) {
      if (!this.isFlipping) {
        break;
      }
      this.world.Step(this.timeStep, this.stepConfig);

      this.drawCoinBody(this.coinBody, foldyCoinElement);

      await waitABit();
    }

    this.isFlipping = false;
  }

  private flipCoin() {
    let random = Math.random();
    let deadZone = .5;
    let modify = random > deadZone ? random : -random - deadZone;
    this.coinBody.SetLinearVelocity({x: modify * 3, y: modify * 6});
    setTimeout(() => this.coinBody.SetAngularVelocity(modify * 7), 50);

    this.renderFlip();
  }

  private createWalls(): b2Body {
    let groundBodyDef: b2BodyDef = {position: {x: 1, y: 1}};
    let body = this.world.CreateBody(groundBodyDef);

    let wallsShapes = [[-1, 0], [0, -1], [1, 0], [0, 1]]
      .map(([x, y], i) => new b2PolygonShape()
        .SetAsBox(1, .01, {x, y}, i & 1 ? 0 : deg90InRad));
    wallsShapes.forEach(w => {
      let fixture = body.CreateFixture({shape: w});
      fixture.SetUserData({
        ...fixture.GetUserData(),
        vertices: w.m_vertices,
        centroid: w.m_centroid,
      });
    });
    return body;
  }

  private drawWalls(wallsBody: b2Body) {
    let wallElements = this.wallsElements().map(r => r.nativeElement as HTMLElement);
    let fixtures = fixturesFromList(wallsBody.GetFixtureList());

    let boxPosition = fixtures[0].GetBody().GetPosition();
    let pairs = pairItems<[HTMLDivElement, b2Fixture]>(wallElements, fixtures);

    for (let [div, fixture] of pairs) {
      let {vertices, centroid} = fixture.GetUserData() as {
        vertices: b2Vec2[], centroid: b2Vec2
      };

      let xs = [];
      let ys = [];
      for (let {x, y} of vertices) {
        xs.push(x);
        ys.push(y);
      }

      let width = Math.max(...xs) - Math.min(...xs);
      let height = Math.max(...ys) - Math.min(...ys);

      let s = this.scale;
      div.style.setProperty('width', width * s + 'px');
      div.style.setProperty('height', height * s + 'px');
      div.style.setProperty('left', (boxPosition.x + centroid.x - width * .5) * s + 'px');
      div.style.setProperty('top', (boxPosition.y + centroid.y - height * .5) * s + 'px');
    }
  }

  private createCoin(): b2Body {
    const coinBodyDef: b2BodyDef = {
      type: b2BodyType.b2_dynamicBody,
      position: {x: 1, y: 1},
      angle: .5,
      angularVelocity: Math.random() * 5 - 2,
      linearVelocity: {x: 0, y: -2},
    };
    let body = this.world.CreateBody(coinBodyDef);
    this.addFixtures(body);

    return body;
  }

  private addFixtures(body: b2Body,
                      configInput?: Partial<ConfigInputAddFixtures>) {
    let defaults: ConfigInputAddFixtures
      = {angle: 0, thickness: .06, length: .5, vertexCount: 15};
    let config: ConfigInputAddFixtures
      = Object.assign(defaults, configInput ?? {});

    let groupCoordinates = config.angle > 0
                           ? this.getFoldedCoordinates(
        config.angle, config.vertexCount, config.length, config.thickness)
                           : this.getFlatCoordinates(
        config.vertexCount, config.length, config.thickness);


    let collisionPointsRadius = config.thickness / 2;
    let shapesInfo = groupCoordinates
      .map(([a, perfect, b], i) => {
        let midPoint = config.vertexCount / 2;
        let distanceToCenter = Math.abs(i - midPoint) / midPoint;
        let proportion = .9;
        let r = ((1 - proportion) + distanceToCenter ** 2 * proportion)
          * collisionPointsRadius;
        return {
          shape: new b2CircleShape(r)
            .Set({x: perfect.x, y: collisionPointsRadius + perfect.y}),
          lines: [a, b],
          distanceToCenter,
        };
      });
    shapesInfo.forEach(({shape, lines, distanceToCenter}) => {
      let def = {
        shape,
        density: (1 - distanceToCenter) ** 5,
        friction: 0.7,
        restitution: .7,
      };
      let fixture = body.CreateFixture(def);
      fixture.SetUserData({
        ...fixture.GetUserData(),
        centroid: shape.m_p,
        drawCoordinates: lines,
      });
    });
  }

  private getFlatCoordinates(count: number,
                             length: number,
                             thickness: number): XY[][] {
    let drawOffset = thickness / 5;

    return makeNumberList(count)
      .map(n => (length * n / count) - (length / 2) + (thickness / 3))
      .map(y => [
        {x: -drawOffset, y},
        {x: 0, y},
        {x: drawOffset, y},
      ]);
  }

  private getFoldedCoordinates(angle: number,
                               count: number,
                               length: number,
                               thickness: number): XY[][] {
    let tau = 2 * Math.PI;
    let circumference = (tau / angle) * length;
    let curlRadius = circumference / tau;
    let drawOffset = thickness / 5;

    let groupCoordinates = makeNumberList(count)
      .map(n => angle * n / count)
      .map(t => [
        polarToCardinal(t - angle / 2, curlRadius - drawOffset),
        polarToCardinal(t - angle / 2, curlRadius),
        polarToCardinal(t - angle / 2, curlRadius + drawOffset),
      ]);
    // Coordinates are generated on edge of circle. The is centered on 0,0
    // offsetting the groupCoordinates away from center
    let sumOfLocations = groupCoordinates.reduce((sum, [, {x, y}]) => {
      sum.x += x;
      sum.y += y;
      return sum;
    }, {x: 0, y: 0});
    let center = {
      x: sumOfLocations.x / count,
      y: sumOfLocations.y / count,
    };

    // Move groupCoordinates towards center
    return groupCoordinates.map(([a, perfect, b]) => [
      {x: a.x - center.x, y: a.y - center.y},
      {x: perfect.x - center.x, y: perfect.y - center.y},
      {x: b.x - center.x, y: b.y - center.y},
    ]);
  }

  private drawCoin(body: b2Body) {
    let element = this.coinElement().nativeElement;
    if (!element) {
      return;
    }

    this.drawCoinBody(body, element);
    let fixtures = fixturesFromList(body.GetFixtureList());

    let lines = fixtures.map(f => {
      let {drawCoordinates} = f.GetUserData() as { drawCoordinates: XY[] };
      return drawCoordinates;
    });
    let s = this.scale;

    let thickness = fixtures[0].GetShape().m_radius;
    let pointsA = lines.map(([{x, y}]) => `${x * s},${y * s}`).join(' ');
    let pointsB = lines.map(([, {x, y}]) => `${x * s},${y * s}`).join(' ');

    let a = this.polylineAElement();
    a.setAttribute('points', pointsA);
    a.style.setProperty('stroke-width', (thickness * s).toString());

    let b = this.polylineBElement();
    b.setAttribute('points', pointsB);
    b.style.setProperty('stroke-width', (thickness * s).toString());
  }

  private drawCoinBody(body: b2Body, element: SVGElement) {
    let s = this.scale;
    let {x, y} = body.GetPosition();
    element.style.setProperty('left', (x - .25) * s + 'px');
    element.style.setProperty('top', (y + .03) * s + 'px');

    let angle = body.GetAngle();
    this.groupElement().style.setProperty('rotate', angle + 'rad');
  }

}
