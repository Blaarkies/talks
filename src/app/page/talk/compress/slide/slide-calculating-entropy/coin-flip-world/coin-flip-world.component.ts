import {
  Component,
  computed,
  effect,
  ElementRef,
  viewChild,
  viewChildren,
} from '@angular/core';
import {
  b2Body,
  b2BodyDef,
  b2BodyType,
  b2CircleShape,
  b2Fixture,
  b2PolygonShape,
  b2StepConfig,
  b2Vec2,
  b2World,
} from '@box2d/core';
import {
  makeNumberList,
  pairItems,
} from '../../../../../../common';

function waitABit(time = 7) {
  return new Promise(r =>
    setTimeout(() =>
      window.requestAnimationFrame(() => r(0)), time));
}

let deg90InRad = Math.PI / 2;

@Component({
  selector: 'app-coin-flip-world',
  standalone: true,
  imports: [],
  templateUrl: './coin-flip-world.component.html',
  styleUrl: './coin-flip-world.component.scss',
})
export class CoinFlipWorldComponent {

  private hammer = viewChild('hammer', {read: ElementRef<HTMLElement>});
  private wallsElements = viewChildren('walls', {read: ElementRef<HTMLElement>});
  private coinElement = viewChild('coin', {read: ElementRef<SVGElement>});
  private polylineElement = computed(() =>
    this.coinElement().nativeElement.querySelector('polyline'));

  private coinBody: b2Body;
  private wallsBody: b2Body;
  private world: b2World;
  private timeStep: number;
  private stepConfig: b2StepConfig;
  private isFlipping = false;
  private scale = 1e3;

  constructor() {
    effect(() => {
      if (!this.wallsElements() || !this.coinElement()) {
        return;
      }

      this.world = b2World.Create({x: 0, y: 4});

      this.wallsBody = this.createWalls();
      this.drawWalls(this.wallsBody);

      this.coinBody = this.createCoin({});
      this.drawCoin(this.coinBody);

      this.stepConfig = {
        velocityIterations: 6,
        positionIterations: 2,
      };
      this.timeStep = 1 / 60;

      this.renderFlip();
    });
  }

  private async renderFlip() {
    if (this.isFlipping) {
      return;
    }

    this.isFlipping = true;
    let foldyCoinElement = this.coinElement().nativeElement;

    for (let i = 0; i < 5000; ++i) {
      this.world.Step(this.timeStep, this.stepConfig);

      this.drawCoinBody(this.coinBody, foldyCoinElement);

      await waitABit();
    }

    this.isFlipping = false;
  }


  protected flipCoin() {
    let sign = Math.random() > .5 ? -1 : 1;
    this.coinBody.ApplyAngularImpulse(sign * 20e-2);

    this.renderFlip();
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

    setTimeout(() => this.flipCoin(), 500 * .25);
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
    let fixtures = this.fixturesFromList(wallsBody.GetFixtureList());

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

  private fixturesFromList(fixture: b2Fixture): b2Fixture[] {
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

  private createCoin({curl = 0, thickness = .06, length = .5}): b2Body {
    const coinBodyDef: b2BodyDef = {
      type: b2BodyType.b2_dynamicBody,
      position: {x: 1, y: 1},
      angle: .5,
      angularVelocity: 2,
      linearVelocity: {x: 0, y: -.05},
    };
    let body = this.world.CreateBody(coinBodyDef);

    let radius = thickness / 2;
    let vertexCount = 10;
    let vertexFactor = length / vertexCount;
    let shapes = makeNumberList(vertexCount).map(n =>
      new b2CircleShape(radius).Set({x: n * vertexFactor, y: radius}));
    shapes.forEach(shape => {
      let def = {
        shape,
        density: 10,
        friction: 0.7,
        restitution: .7,
      };
      let fixture = body.CreateFixture(def);

      fixture.SetUserData({
        ...fixture.GetUserData(),
        radius: shape.m_radius,
        centroid: shape.m_p,
      });
    });

    return body;
  }

  private drawCoin(body: b2Body) {
    let element = this.coinElement().nativeElement;
    if (!element) {
      return;
    }

    this.drawCoinBody(body, element);
    let fixtures = this.fixturesFromList(body.GetFixtureList());

    let centroids = fixtures.map(f => {
      let {centroid} = f.GetUserData() as { radius: number, centroid: b2Vec2 };
      return centroid;
    });
    let s = this.scale;

    let thickness = fixtures[0].GetShape().m_radius;
    let points = centroids.map(({x, y}) =>
      `${x * s},${(y - thickness) * s}`).join(' ');

    let polyline = element.querySelector('polyline') as SVGPolylineElement;
    polyline.setAttribute('points', points);
    polyline.style.setProperty('stroke-width', thickness * s + '');
  }

  private drawCoinBody(body: b2Body, element: SVGElement) {
    let s = this.scale;
    let {x, y} = body.GetPosition();
    element.style.setProperty('left', (x - .25) * s + 'px');
    element.style.setProperty('top', (y + .03) * s + 'px');

    let angle = body.GetAngle();
    this.polylineElement().style.setProperty('rotate', angle + 'rad');
  }

}
