let r1  ,//length of 1st line
r2,//length of 2bt line
m1,//mass of 1st blob
m2 ,//mass of 2nd blob
a1 ,// angle 1
a2, // angle 2
a1_v = 0, //velocity
a2_v = 0,
a1_a = 0, //acceleration
a2_a = 0,
friction,
frameCount ,
g , // gravity
renderSpeed ;

let GATE = false;
const frame = document.getElementById('frame');
const centerX = frame.getBoundingClientRect().width/ 2;
const centerY =  frame.getBoundingClientRect().height / 4;

/* Pendulm Parts */
const l1 = document.createElementNS("http://www.w3.org/2000/svg", 'line'); 
const l2 = document.createElementNS("http://www.w3.org/2000/svg", 'line'); 
const c1 = document.createElementNS("http://www.w3.org/2000/svg", 'circle'); 
const c2 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
const path = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
    
const getData = () => {
    r1 = document.getElementById('l1').value  
    r2 = document.getElementById('l2').value  
    m1 = document.getElementById('m1').value 
    m2 = document.getElementById('m2').value 
    a1 = document.getElementById('a1').value * (Math.PI / 180),
    a2 = document.getElementById('a2').value * (Math.PI / 180), 
    friction = document.getElementById('friction').value,
    g = document.getElementById('g').value,
    
    frameCount = document.getElementById('speed').value,
    renderSpeed = 60 -  frameCount ;
}
getData()

const reset = () => {
  getData()
  path.points.clear();
  a1_v = 0
  a2_v = 0
  a1_a = 0
  a2_a = 0
}
/* Sleep function to set movment speed */
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

/* Line cord */
const lineCord = (r, a, xPrevious = 0, yPrevious = 0) => {
  const x = (xPrevious + r * Math.sin(a)) ;
  const y = (yPrevious +  r * Math.cos(a)) ;

  return (xPrevious === 0 && yPrevious === 0)?[x  + centerX, y  + centerY] : [x , y]
}

/* path drawer */
const pathDrawer = (x, y) => {
  const point = frame.createSVGPoint();
  point.x = x;
  point.y = y;
  path.points.appendItem(point);
}

/* acceleration updater */
const updateAcceleration = () =>{
  let numrator1   = -g * (2 * m1 + m2) * Math.sin(a1),
        numrator2   = -m2 * g * Math.sin(a1 - 2 * a2),
        numrator3   = -2 * Math.sin(a1 - a2) * m2,
        numrator4   = (a2_v ** 2) * r2 + (a1_v ** 2) * r1 * Math.cos(a1 - a2),
        denomenator = r1 * (2 * m1 + m2 - m2 * Math.cos(2*a1 - 2*a2));

  a1_a = (numrator1 + numrator2 + (numrator3*numrator4)) / denomenator; 

        numrator1   = 2 * Math.sin(a1-a2),
        numrator2   = (a1_v **2) * r1 * (m1 + m2),
        numrator3   = g * (m1 + m2) * Math.cos(a1),
        numrator4   = (a2_v ** 2) * r2 * m2 * Math.cos(a1 - a2),
        denomenator = r2 * (2 * m1 + m2 - m2 * Math.cos(2*a1 - 2*a2));

  a2_a = (numrator1*(numrator2 + numrator3 + numrator4))/ denomenator;
}

/* Apply friction to current pendulm speed */
const applyFriction = () =>{
  a1_v *= friction;
  a2_v *= friction;
}

/* Initial position setup */
const setup = () => {

  /* path config */
  path.style.strokeWidth = "1px";
  path.style.stroke = "grey";
  path.style.fill = "transparent"
  frame.appendChild(path)

  /* Roof */
  const roofHalfLength = 100;
  const roof = document.createElementNS("http://www.w3.org/2000/svg", 'line'); 
  roof.setAttribute('x1', centerX - roofHalfLength);
  roof.setAttribute('y1', centerY);
  roof.setAttribute('x2', centerX + roofHalfLength);
  roof.setAttribute('y2', centerY);
  roof.style.strokeWidth = "3px";
  roof.style.stroke = "#000"
  frame.appendChild(roof);



  /* L1 */
  let [x1 , y1] = lineCord(r1, a1);


  l1.setAttribute('x1', centerX);
  l1.setAttribute('y1', centerY);
  l1.setAttribute('x2', x1 );
  l1.setAttribute('y2', y1 );

  l1.style.strokeWidth = "3px";
  l1.style.stroke = "red"
  frame.appendChild(l1);
  
  
  /* L2 */
  let [x2, y2] = lineCord(r2 , a2, x1, y1);

  l2.setAttribute('x1', x1);
  l2.setAttribute('y1', y1);
  l2.setAttribute('x2', x2 );
  l2.setAttribute('y2', y2 );

  l2.style.strokeWidth = "3px";
  l2.style.stroke = "blue"
  frame.appendChild(l2);

  console.log(x2, y2 ,x1, y1)
  /* M1 */

  c1.setAttribute('cx', x1);
  c1.setAttribute('cy', y1);
  c1.setAttribute('r', m1);
  c1.style.fill = "#FF003F";
  c1.style.strokeWidth = "2px";
  c1.style.stroke = "#BE0032";
  
  frame.appendChild(c1)

  /* M2 */
  c2.setAttribute('cx', x2);
  c2.setAttribute('cy', y2);
  c2.setAttribute('r', m2);
  c2.style.fill = "#1167b1";
  c2.style.strokeWidth = "2px";
  c2.style.stroke = "#03254c";

  frame.appendChild(c2);

}

/* render components */
const draw = () => {

  let [x1, y1] = lineCord(r1, a1);
  let [x2, y2] = lineCord(r2, a2, x1, y1);


  /* change L1 */
  l1.setAttribute('x1', centerX);
  l1.setAttribute('y1', centerY);
  l1.setAttribute('x2', x1 );
  l1.setAttribute('y2', y1 );

  /* change L2 */
  l2.setAttribute('x1', x1);
  l2.setAttribute('y1', y1);
  l2.setAttribute('x2', x2 );
  l2.setAttribute('y2', y2 );

  /* change M1 */
  c1.setAttribute('cx', x1);
  c1.setAttribute('cy', y1);
  c1.setAttribute('r', m1);

  /* change M2 */
  c2.setAttribute('cx', x2);
  c2.setAttribute('cy', y2);
  c2.setAttribute('r', m2);


  /* Path */
  pathDrawer(x2, y2)

  updateAcceleration();
  
  a1_v += a1_a;
  a2_v += a2_a;
  a1 += a1_v;
  a2 += a2_v;

  applyFriction();



}


const play = async () => {
  while(GATE){
    draw()
    await sleep(renderSpeed)
  }
}


document.querySelectorAll('input').forEach(e => {
  e.addEventListener('input', () =>{
    GATE=false
    reset();
    draw()
  })
})

document.querySelector('#start').addEventListener('click', () => {
  GATE = true;
  reset();
  play();
});

document.querySelector('#play').addEventListener('click', () => {
  GATE = !GATE
  play();
})

/*  Called only one time to render items */
setup()







