// Particles background and micro-interactions for premium feel
(function(){
  const canvas=document.getElementById('particleCanvas');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  let particles=[];
  const isMobile=window.matchMedia('(max-width: 760px)').matches;
  const particleCount=isMobile?80:140;
  let pointer={x:window.innerWidth/2, y:window.innerHeight/2};

  function resizeCanvas(){canvas.width=window.innerWidth;canvas.height=window.innerHeight}
  window.addEventListener('resize',resizeCanvas,{passive:true});
  resizeCanvas();

  class Particle{
    constructor(){this.reset()}
    reset(){
      this.x=Math.random()*canvas.width;
      this.y=Math.random()*canvas.height;
      this.size=Math.random()*2.2+0.6;
      this.speedX=(Math.random()-0.5)*0.35;
      this.speedY=(Math.random()-0.5)*0.35;
      this.depth=Math.random()*30+6;
    }
    update(){
      this.x+=this.speedX+((pointer.x-canvas.width/2)*0.00025*this.depth);
      this.y+=this.speedY+((pointer.y-canvas.height/2)*0.00025*this.depth);
      if(this.x<-50||this.x>canvas.width+50||this.y<-50||this.y>canvas.height+50)this.reset();
    }
    draw(){
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
      ctx.fillStyle='rgba(70,215,163,0.22)';
      ctx.fill();
    }
  }

  for(let i=0;i<particleCount;i++) particles.push(new Particle());

  function drawLines(){
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x;
        const dy=particles[i].y-particles[j].y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<120){
          ctx.strokeStyle=`rgba(70,215,163,${0.10+0.25*(1-dist/120)})`;
          ctx.lineWidth=1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x,particles[i].y);
          ctx.lineTo(particles[j].x,particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function drawShapes(){
    const blobs=isMobile?2:4;
    for(let i=0;i<blobs;i++){
      const x=Math.sin(Date.now()/5000+i)*220+canvas.width/2;
      const y=Math.cos(Date.now()/5000+i)*160+canvas.height/2;
      ctx.beginPath();
      ctx.arc(x,y,isMobile?40:60,0,Math.PI*2);
      ctx.fillStyle='rgba(70,215,163,0.04)';
      ctx.fill();
    }
  }

  function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawShapes();
    particles.forEach(p=>{p.update();p.draw()});
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();

  function updatePointer(e){
    if(e.touches){pointer.x=e.touches[0].clientX;pointer.y=e.touches[0].clientY}
    else{pointer.x=e.clientX;pointer.y=e.clientY}
  }
  document.addEventListener('mousemove',updatePointer,{passive:true});
  document.addEventListener('touchmove',updatePointer,{passive:true});

  // Smooth reveal on scroll
  const observer=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('in-view')}
    })
  },{threshold:0.14});

  document.querySelectorAll('.section, .card, .panel, .feature').forEach(el=>{
    el.classList.add('will-reveal');
    observer.observe(el);
  });

  // Smooth scroll enhancement for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',(e)=>{
      const id=a.getAttribute('href');
      if(id.length>1){
        const target=document.querySelector(id);
        if(target){
          e.preventDefault();
          const top=target.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({top, behavior:'smooth'});
        }
      }
    });
  });

  // Year
  const y=document.getElementById('year');
  if(y) y.textContent=new Date().getFullYear();
})();


