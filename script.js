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

  // Mobile nav toggle
  const toggle=document.querySelector('.nav-toggle');
  const navLinks=document.querySelector('.nav-links');
  if(toggle && navLinks){
    toggle.addEventListener('click',()=>{
      document.body.classList.toggle('nav-open');
    });
    navLinks.querySelectorAll('a').forEach(link=>{
      link.addEventListener('click',()=>{ document.body.classList.remove('nav-open') });
    });
  }

  // Year
  const y=document.getElementById('year');
  if(y) y.textContent=new Date().getFullYear();
})();


// Lightweight i18n with URL (?lang=) override and localStorage persistence
(function(){
  const SUPPORTED=["es","gl","en"];
  const STORAGE_KEY="lang";

  function getParamLang(){
    const params=new URLSearchParams(window.location.search);
    const l=(params.get('lang')||'').toLowerCase();
    return SUPPORTED.includes(l)?l:null;
  }

  function getStoredLang(){
    try{const l=localStorage.getItem(STORAGE_KEY);return SUPPORTED.includes(l)?l:null}catch(_){return null}
  }

  function getInitialLang(){
    return getParamLang() || getStoredLang() || (document.documentElement.getAttribute('lang')||'es').toLowerCase();
  }

  const translations={
    es:{
      // Meta titles by page
      meta:{
        home:"Inspiror — Inspira tu futuro",
        inspirar:"Inspiror — Quiero inspirar",
        inspirarme:"Inspiror — Quiero inspirarme",
        manifesto:"Inspiror — Manifiesto"
      },
      nav:{
        openMenu:"Abrir menú",
        problem:"El problema",
        vision:"Visión",
        how:"Cómo lo hacemos",
        howShort:"Cómo",
        manifesto:"Manifiesto",
        inspireMe:"Quiero inspirarme",
        inspire:"Quiero inspirar"
      },
      footer:{
        madeInGalicia:"© {year} Inspiror. Hecho en Galicia"
      },
      hero:{
        badge:"Organización sin ánimo de lucro",
        title:"Inspira tu futuro. Rompe con lo establecido.",
        subtitle:"Una organización sin ánimo de lucro que conecta estudiantes con jóvenes que ya rompieron moldes. Historias reales, consejos sin humo y una intención: explora, decide y construye tu propio camino.",
        ctaInspireMe:"Quiero inspirarme",
        ctaInspire:"Quiero inspirar"
      },
      problem:{
        title:"🚨 El problema",
        subtitle:"¿Qué está pasando?",
        p1:"Muchos estudiantes siguen un camino marcado sin parar a explorar lo que de verdad les mueve.",
        li1:"🎓 A veces pesa más “sacar el título rápido” que aprender en profundidad.",
        li2:"💼 Los primeros trabajos suelen ser repetitivos y poco creativos.",
        li3:"🔒 Se prioriza la seguridad inmediata frente a la curiosidad y la exploración.",
        consequenceTitle:"Consecuencia",
        consequence:"Si los jóvenes no exploran su potencial, perdemos todos. Se reduce la capacidad de innovar con sello propio, y se pierden nuevas ideas y perspectivas. Nuestro país necesita más creatividad para construir un futuro competitivo y abierto al mundo."
      },
      vision:{
        title:"🌟 Nuestra visión",
        kicker:"Frase clave",
        headline:"Queremos una generación que se atreva a explorar, crear y aprender con propósito.",
        lead:"Inspiror no te dice qué hacer. Te enseña opciones reales para que elijas con criterio. La educación y las experiencias valen más cuando te hacen crecer, no solo cuando suman un título. Abramos miradas, conectemos con quienes ya se atrevieron y tomemos decisiones con intención."
      },
      how:{
        title:"Cómo lo hacemos",
        t1:"Charlas inspiradoras",
        p1:"Graduados y jóvenes profesionales cuentan cómo rompieron las reglas establecidas.",
        t2:"Mentorías cercanas",
        p2:"Estudiantes reciben guía personalizada de alguien que ya estuvo en su lugar.",
        t3:"Perspectiva global",
        p3:"Fomentamos experiencias fuera de Galicia y entornos diversos que amplían horizontes."
      },
      cta:{
        studentTitle:"Si eres estudiante",
        studentText:"Descubre nuevas posibilidades para tu futuro con ejemplos concretos y cercanos.",
        studentCta:"👉 Quiero inspirarme",
        mentorTitle:"Si eres mentor",
        mentorText:"Comparte tu experiencia y ayuda a que otros den el siguiente paso con más claridad.",
        mentorCta:"👉 Quiero inspirar"
      },
      faq:{
        title:"Preguntas frecuentes",
        q1:"¿Para quién es Inspiror?",
        a1:"Para estudiantes de bachillerato, FP y primeros años de carrera que quieren abrir su mirada y tomar decisiones con más criterio.",
        q2:"¿Qué problema atacamos?",
        a2:"Demasiada prisa por los títulos, poca profundidad al aprender y primeras experiencias que no dejan crear. Ayudamos a recuperar curiosidad, ambición y pensamiento crítico.",
        q3:"¿Está tan mal el camino seguro?",
        a3:"No. Puede ser una buena elección si encaja contigo; el problema es que hoy es lo más promovido y muchos lo eligen por inercia, comparaciones prematuras o presiones de grupo. Necesitamos más creatividad y caminos distintos.",
        q4:"¿Fomentáis solo el emprendimiento?",
        a4:"No. Fomentamos creatividad y criterio. Puedes vivir experiencias creativas sin emprender: investigación, proyectos open‑source, intraemprendimiento, arte, voluntariado técnico o estancias en otros entornos.",
        q5:"¿Necesito ir a universidad para “llegar lejos”?",
        a5:"La universidad no es el único camino, pero sí una palanca si la aprovechas: red, criterio y pensamiento crítico. Lo importante es cómo la usas, el título es solo un recurso más.",
        q6:"¿Por qué promovéis experiencias fuera de Galicia?",
        a6:"Vivir fuera (aunque sea temporalmente) rompe sesgos de grupo, te obliga a conocerte mejor y te expone a oportunidades y estándares distintos.",
        q7:"¿Cómo te ayudamos en la práctica?",
        a7:"Charlas con historias reales y accionables, mentorías 1:1 y conexiones con comunidades y oportunidades que amplían horizontes.",
        q8:"¿Tiene coste participar?",
        a8:"Inspiror es sin ánimo de lucro. Nuestro objetivo es concienciar y formar criterio; buscamos que actividades como charlas y mentorías sean gratuitas."
      },
      final:{
        title:"Quien inspira, crea una cadena de inspiración."
      },
      inspirar:{
        pageTitle:"Quiero inspirar",
        pageLead:"Si seguiste un camino distinto, tu historia puede desbloquear a alguien que está ahora donde tú estuviste.",
        howHelp:"Cómo puedes ayudar",
        li1:"Dar una charla (presencial u online) con aprendizajes prácticos.",
        li2:"Ofrecer mentorías 1:1 a estudiantes con intereses afines.",
        li3:"Abrir puertas: recomendaciones, prácticas, comunidades y oportunidades.",
        li4:"Ayudar a que más jóvenes tengan experiencias fuera de Galicia.",
        propose:"Propón tu colaboración",
        tellUs:"Cuéntanos cómo te gustaría aportar y tu disponibilidad.",
        namePlaceholder:"Tu nombre",
        emailPlaceholder:"Tu email",
        messagePlaceholder:"Cómo te gustaría colaborar",
        submit:"Quiero inspirar",
        card1Title:"Qué buscamos",
        card1Text:"Historias honestas, criterio, y ganas de ayudar.",
        card2Title:"Qué ofrecemos",
        card2Text:"Comunidad, visibilidad y estructura para maximizar impacto.",
        card3Title:"Compromiso",
        card3Text:"Flexible. Empezar pequeño, crecer con intención."
      },
      inspirarme:{
        pageTitle:"Quiero inspirarme",
        pageLead:"Conecta con gente real que ya tomó decisiones difíciles. Aprende de sus aciertos y tropiezos para elegir mejor tu siguiente paso.",
        whatYouGet:"Qué te llevas",
        li1:"Charlas con historias reales y consejos aplicables.",
        li2:"Mentorías 1:1 para desbloquear tu siguiente paso.",
        li3:"Puentes hacia comunidades y oportunidades (también fuera de Galicia).",
        li4:"Más criterio para decidir con libertad.",
        signup:"Apúntate",
        signupLead:"Te avisaremos de la próxima charla o mentoría disponible.",
        namePlaceholder:"Tu nombre",
        emailPlaceholder:"Tu email",
        submit:"Quiero inspirarme"
      },
      manifesto:{
        pageTitle:"Manifiesto",
        pageLead:"Inspira. Descubre. Atrévete.",
        p1:"En cada aula hay talento, ideas y sueños que merecen más espacio.",
        p2:"En cada estudiante hay potencial para crear algo único, algo propio.",
        p3:"Pero muchas veces, el camino que se muestra es uno solo. Seguro, conocido, repetido.",
        p4:"En Inspiror creemos que hay más de una forma de construir un futuro con sentido.",
        p5:"Y queremos ayudar a descubrirlas.",
        p6:"Conectamos a estudiantes de bachillerato y universidad con jóvenes que decidieron seguir rutas diferentes, fuera de lo convencional, y que han encontrado ahí su voz, su fuerza y su lugar.",
        p7:"Historias reales, cercanas, posibles.",
        p8:"Ejemplos que inspiran no por ser perfectos, sino por ser valientes.",
        p9:"Queremos despertar la curiosidad, alimentar la confianza y abrir horizontes.",
        p10:"No para decirles a los jóvenes lo que deben hacer, sino para recordarles que pueden elegir.",
        p11:"Porque el futuro no está escrito.",
        p12:"Y las decisiones importantes no se toman por inercia, se toman con propósito.",
        p13:"Inspiror nace para encender esa chispa.",
        p14:"Para que más jóvenes se atrevan a soñar en grande… y a caminar hacia ello.",
        beliefsTitle:"Lo que creemos",
        betTitle:"Nuestra apuesta",
        betText:"Experiencias que amplían la mirada: historias reales, mentorías cercanas y horizontes más amplios.",
        chainTitle:"Cadena de inspiración",
        chainText:"Cuando alguien inspira, otros se atreven. Eso es comunidad."
      }
    },
    gl:{
      meta:{
        home:"Inspiror — Inspira o teu futuro",
        inspirar:"Inspiror — Quero inspirar",
        inspirarme:"Inspiror — Quero inspirarme",
        manifesto:"Inspiror — Manifesto"
      },
      nav:{
        openMenu:"Abrir menú",
        problem:"O problema",
        vision:"Visión",
        how:"Como o facemos",
        howShort:"Como",
        manifesto:"Manifesto",
        inspireMe:"Quero inspirarme",
        inspire:"Quero inspirar"
      },
      footer:{
        madeInGalicia:"© {year} Inspiror. Feito en Galicia"
      },
      hero:{
        badge:"Organización sen ánimo de lucro",
        title:"Inspira o teu futuro. Rompe co establecido.",
        subtitle:"Unha organización sen ánimo de lucro que conecta estudantes con mozos que xa romperon moldes. Historias reais, consellos sen fume e unha intención: explora, decide e constrúe o teu propio camiño.",
        ctaInspireMe:"Quero inspirarme",
        ctaInspire:"Quero inspirar"
      },
      problem:{
        title:"🚨 O problema",
        subtitle:"Que está a pasar?",
        p1:"Moitos estudantes seguen un camiño marcado sen parar a explorar o que de verdade lles move.",
        li1:"🎓 Ás veces pesa máis “sacar o título axiña” ca aprender en profundidade.",
        li2:"💼 Os primeiros traballos adoitan ser repetitivos e pouco creativos.",
        li3:"🔒 Priorízase a seguridade inmediata fronte á curiosidade e á exploración.",
        consequenceTitle:"Consecuncia",
        consequence:"Se a xente nova non explora o seu potencial, perdemos todos. Redúcese a capacidade de innovar con selo propio e pérdense ideas e perspectivas novas. O noso país precisa máis creatividade para construír un futuro competitivo e aberto ao mundo."
      },
      vision:{
        title:"🌟 A nosa visión",
        kicker:"Frase clave",
        headline:"Queremos unha xeración que se atreva a explorar, crear e aprender con propósito.",
        lead:"Inspiror non che di que facer. Amósache opcións reais para que elixas con criterio. A educación e as experiencias valen máis cando te fan medrar, non só cando suman un título. Abramos miradas, conectemos con quen xa se atreveu e tomemos decisións con intención."
      },
      how:{
        title:"Como o facemos",
        t1:"Charlas inspiradoras",
        p1:"Graduados e mozos profesionais contan como romperon as regras establecidas.",
        t2:"Mentorías próximas",
        p2:"Estudantes reciben guía personalizada de alguén que xa estivo no seu lugar.",
        t3:"Perspectiva global",
        p3:"Fomentamos experiencias fóra de Galicia e contornos diversos que amplían horizontes."
      },
      cta:{
        studentTitle:"Se es estudante",
        studentText:"Descubre novas posibilidades para o teu futuro con exemplos concretos e próximos.",
        studentCta:"👉 Quero inspirarme",
        mentorTitle:"Se es mentor",
        mentorText:"Comparte a túa experiencia e axuda a que outros dean o seguinte paso con máis claridade.",
        mentorCta:"👉 Quero inspirar"
      },
      faq:{
        title:"Preguntas frecuentes",
        q1:"Para quen é Inspiror?",
        a1:"Para estudantes de bacharelato, FP e primeiros anos de carreira que queren abrir a súa mirada e tomar decisións con máis criterio.",
        q2:"Que problema atacamos?",
        a2:"Demasiada présa polos títulos, pouca profundidade ao aprender e primeiras experiencias que non deixan crear. Axudamos a recuperar curiosidade, ambición e pensamento crítico.",
        q3:"É tan malo o camiño seguro?",
        a3:"Non. Pode ser unha boa elección se encaixa contigo; o problema é que hoxe é o máis promovido e moitos elíxeno por inercia, comparacións prematuras ou presións de grupo. Precisamos máis creatividade e camiños distintos.",
        q4:"Promovedes só o emprendemento?",
        a4:"Non. Promovemos creatividade e criterio. Podes vivir experiencias creativas sen emprender: investigación, proxectos open‑source, intraemprendemento, arte, voluntariado técnico ou estadías noutros contornos.",
        q5:"Necesito ir á universidade para “chegar lonxe”?",
        a5:"A universidade non é o único camiño, pero si unha palanca se a aproveitas: rede, criterio e pensamento crítico. O importante é como a usas; o título é só un recurso máis.",
        q6:"Por que promovedes experiencias fóra de Galicia?",
        a6:"Vivir fóra (aínda que sexa temporalmente) rompe sesgos de grupo, obrígache a coñecerte mellor e expónte a oportunidades e estándares distintos.",
        q7:"Como che axudamos na práctica?",
        a7:"Charlas con historias reais e accionables, mentorías 1:1 e conexións con comunidades e oportunidades que amplían horizontes.",
        q8:"Ten custo participar?",
        a8:"Inspiror é sen ánimo de lucro. O noso obxectivo é concienciar e formar criterio; buscamos que actividades como charlas e mentorías sexan gratuítas."
      },
      final:{
        title:"Quen inspira, crea unha cadea de inspiración."
      },
      inspirar:{
        pageTitle:"Quero inspirar",
        pageLead:"Se seguiches un camiño distinto, a túa historia pode desbloquear a alguén que está agora onde ti estiveches.",
        howHelp:"Como podes axudar",
        li1:"Dar unha charla (presencial ou en liña) con aprendizaxes prácticos.",
        li2:"Ofrecer mentorías 1:1 a estudantes con intereses afíns.",
        li3:"Abrir portas: recomendacións, prácticas, comunidades e oportunidades.",
        li4:"Axudar a que máis mozos teñan experiencias fóra de Galicia.",
        propose:"Propón a túa colaboración",
        tellUs:"Cóntanos como che gustaría achegar e a túa dispoñibilidade.",
        namePlaceholder:"O teu nome",
        emailPlaceholder:"O teu correo",
        messagePlaceholder:"Como che gustaría colaborar",
        submit:"Quero inspirar",
        card1Title:"Que buscamos",
        card1Text:"Historias honestas, criterio e ganas de axudar.",
        card2Title:"Que ofrecemos",
        card2Text:"Comunidade, visibilidade e estrutura para maximizar impacto.",
        card3Title:"Compromiso",
        card3Text:"Flexible. Comezar pequeno, medrar con intención."
      },
      inspirarme:{
        pageTitle:"Quero inspirarme",
        pageLead:"Conecta con xente real que xa tomou decisións difíciles. Aprende dos acertos e tropezos para elixir mellor o teu seguinte paso.",
        whatYouGet:"Que levas",
        li1:"Charlas con historias reais e consellos aplicables.",
        li2:"Mentorías 1:1 para desbloquear o teu seguinte paso.",
        li3:"Pontes cara comunidades e oportunidades (tamén fóra de Galicia).",
        li4:"Máis criterio para decidir con liberdade.",
        signup:"Apúntate",
        signupLead:"Avisarémoste da próxima charla ou mentoría dispoñible.",
        namePlaceholder:"O teu nome",
        emailPlaceholder:"O teu correo",
        submit:"Quero inspirarme"
      },
      manifesto:{
        pageTitle:"Manifesto",
        pageLead:"Inspira. Descubre. Atrévete.",
        p1:"En cada aula hai talento, ideas e soños que merecen máis espazo.",
        p2:"En cada estudante hai potencial para crear algo único, algo propio.",
        p3:"Pero moitas veces, o camiño que se amosa é un só. Seguro, coñecido, repetido.",
        p4:"En Inspiror cremos que hai máis dunha forma de construír un futuro con sentido.",
        p5:"E queremos axudar a descubrílas.",
        p6:"Conectamos estudantes de bacharelato e universidade con mozos que decidiron seguir rutas diferentes, fóra do convencional, e que atoparon aí a súa voz, a súa forza e o seu lugar.",
        p7:"Historias reais, próximas, posibles.",
        p8:"Exemplos que inspiran non por seren perfectos, senón por seren valentes.",
        p9:"Queremos espertar a curiosidade, alimentar a confianza e abrir horizontes.",
        p10:"Non para dicirlles á xente nova o que debe facer, senón para lembrarlles que poden elixir.",
        p11:"Porque o futuro non está escrito.",
        p12:"E as decisións importantes non se toman por inercia, tómanse con propósito.",
        p13:"Inspiror nace para acender esa chispa.",
        p14:"Para que máis mozos se atrevan a soñar en grande… e a camiñar cara a iso.",
        beliefsTitle:"No que cremos",
        betTitle:"A nosa aposta",
        betText:"Experiencias que amplían a mirada: historias reais, mentorías próximas e horizontes máis amplos.",
        chainTitle:"Cadea de inspiración",
        chainText:"Cando alguén inspira, outros atrévense. Iso é comunidade."
      }
    },
    en:{
      meta:{
        home:"Inspiror — Inspire your future",
        inspirar:"Inspiror — I want to inspire",
        inspirarme:"Inspiror — I want to be inspired",
        manifesto:"Inspiror — Manifesto"
      },
      nav:{
        openMenu:"Open menu",
        problem:"The problem",
        vision:"Vision",
        how:"How we do it",
        howShort:"How",
        manifesto:"Manifesto",
        inspireMe:"I want to be inspired",
        inspire:"I want to inspire"
      },
      footer:{
        madeInGalicia:"© {year} Inspiror. Made in Galicia"
      },
      hero:{
        badge:"Non-profit organization",
        title:"Inspire your future. Break the mold.",
        subtitle:"A non-profit that connects students with young people who already broke the mold. Real stories, no‑fluff advice, and one aim: explore, decide, and build your own path.",
        ctaInspireMe:"I want to be inspired",
        ctaInspire:"I want to inspire"
      },
      problem:{
        title:"🚨 The problem",
        subtitle:"What is happening?",
        p1:"Many students follow a set path without pausing to explore what truly moves them.",
        li1:"🎓 Sometimes “getting the degree fast” outweighs learning in depth.",
        li2:"💼 First jobs are often repetitive and not very creative.",
        li3:"🔒 Immediate safety is prioritized over curiosity and exploration.",
        consequenceTitle:"Consequence",
        consequence:"If young people do not explore their potential, everyone loses. Our capacity to innovate with our own stamp shrinks, and new ideas and perspectives are lost. Our country needs more creativity to build a competitive, open future."
      },
      vision:{
        title:"🌟 Our vision",
        kicker:"Key phrase",
        headline:"We want a generation that dares to explore, create, and learn with purpose.",
        lead:"Inspiror does not tell you what to do. It shows real options so you can choose wisely. Education and experiences are worth more when they help you grow, not only when they add a title. Let’s broaden perspectives, connect with those who already dared, and make decisions with intention."
      },
      how:{
        title:"How we do it",
        t1:"Inspiring talks",
        p1:"Graduates and young professionals share how they broke established rules.",
        t2:"Close mentoring",
        p2:"Students receive personalized guidance from someone who has been in their place.",
        t3:"Global perspective",
        p3:"We promote experiences outside Galicia and diverse environments that broaden horizons."
      },
      cta:{
        studentTitle:"If you are a student",
        studentText:"Discover new possibilities for your future with concrete, relatable examples.",
        studentCta:"👉 I want to be inspired",
        mentorTitle:"If you are a mentor",
        mentorText:"Share your experience and help others take their next step with clarity.",
        mentorCta:"👉 I want to inspire"
      },
      faq:{
        title:"Frequently asked questions",
        q1:"Who is Inspiror for?",
        a1:"For high-school, vocational and early university students who want to broaden their view and make decisions with more criteria.",
        q2:"What problem are we tackling?",
        a2:"Too much rush for degrees, little depth in learning, and first experiences that don’t allow creating. We help recover curiosity, ambition and critical thinking.",
        q3:"Is the safe path that bad?",
        a3:"No. It can be a good choice if it fits you; the issue is that today it’s the most promoted and many choose it by inertia, early comparisons or group pressure. We need more creativity and different paths.",
        q4:"Do you only promote entrepreneurship?",
        a4:"No. We promote creativity and sound judgment. You can live creative experiences without founding a company: research, open‑source projects, intrapreneurship, art, technical volunteering or stays in other environments.",
        q5:"Do I need to go to university to “go far”?",
        a5:"University is not the only path, but it can be a lever if you make the most of it: network, judgment and critical thinking. What matters is how you use it; the degree is just another resource.",
        q6:"Why do you promote experiences outside Galicia?",
        a6:"Living abroad (even temporarily) breaks group biases, forces self‑knowledge and exposes you to different opportunities and standards.",
        q7:"How do we help in practice?",
        a7:"Talks with real, actionable stories, 1:1 mentoring and connections with communities and opportunities that broaden horizons.",
        q8:"Does it cost to participate?",
        a8:"Inspiror is non‑profit. Our goal is awareness and sound judgment; we aim for activities such as talks and mentoring to be free."
      },
      final:{
        title:"Those who inspire create a chain of inspiration."
      },
      inspirar:{
        pageTitle:"I want to inspire",
        pageLead:"If you took a different path, your story can unlock someone who is now where you once were.",
        howHelp:"How you can help",
        li1:"Give a talk (in person or online) with practical learnings.",
        li2:"Offer 1:1 mentoring to students with related interests.",
        li3:"Open doors: recommendations, internships, communities and opportunities.",
        li4:"Help more young people have experiences outside Galicia.",
        propose:"Propose your collaboration",
        tellUs:"Tell us how you would like to contribute and your availability.",
        namePlaceholder:"Your name",
        emailPlaceholder:"Your email",
        messagePlaceholder:"How you would like to collaborate",
        submit:"I want to inspire",
        card1Title:"What we look for",
        card1Text:"Honest stories, sound judgment, and a desire to help.",
        card2Title:"What we offer",
        card2Text:"Community, visibility and structure to maximize impact.",
        card3Title:"Commitment",
        card3Text:"Flexible. Start small, grow with intention."
      },
      inspirarme:{
        pageTitle:"I want to be inspired",
        pageLead:"Connect with real people who already made tough decisions. Learn from their wins and missteps to choose your next step better.",
        whatYouGet:"What you get",
        li1:"Talks with real stories and practical advice.",
        li2:"1:1 mentoring to unlock your next step.",
        li3:"Bridges to communities and opportunities (also outside Galicia).",
        li4:"More judgment to decide freely.",
        signup:"Sign up",
        signupLead:"We’ll let you know about the next talk or mentoring session available.",
        namePlaceholder:"Your name",
        emailPlaceholder:"Your email",
        submit:"I want to be inspired"
      },
      manifesto:{
        pageTitle:"Manifesto",
        pageLead:"Inspire. Discover. Dare.",
        p1:"In every classroom there is talent, ideas and dreams that deserve more space.",
        p2:"In every student there is potential to create something unique, something of their own.",
        p3:"But often the path shown is just one. Safe, familiar, repeated.",
        p4:"At Inspiror we believe there is more than one way to build a meaningful future.",
        p5:"And we want to help discover them.",
        p6:"We connect high‑school and university students with young people who decided to follow different routes, outside the conventional, and found their voice, strength and place there.",
        p7:"Real, close, possible stories.",
        p8:"Examples that inspire not because they are perfect, but because they are brave.",
        p9:"We want to awaken curiosity, feed confidence and open horizons.",
        p10:"Not to tell young people what they must do, but to remind them they can choose.",
        p11:"Because the future is not written.",
        p12:"And important decisions are not made by inertia, they are made with purpose.",
        p13:"Inspiror is born to spark that flame.",
        p14:"So that more young people dare to dream big… and walk towards it.",
        beliefsTitle:"What we believe",
        betTitle:"Our bet",
        betText:"Experiences that broaden one’s view: real stories, close mentoring and wider horizons.",
        chainTitle:"Chain of inspiration",
        chainText:"When someone inspires, others dare. That’s community."
      }
    }
  };

  function format(template, vars){
    return template.replace(/\{(\w+)\}/g,(_,k)=>vars[k]!==undefined?vars[k]:`{${k}}`);
  }

  function applyTranslations(lang){
    const dict=translations[lang]||translations.es;
    document.documentElement.setAttribute('lang', lang);
    // Title by route
    const path=location.pathname;
    let title=dict.meta.home;
    if(path.endsWith('/wip/inspirar.html')) title=dict.meta.inspirar;
    else if(path.endsWith('/wip/inspirarme.html')) title=dict.meta.inspirarme;
    else if(path.endsWith('/wip/manifesto.html')) title=dict.meta.manifesto;
    document.title=title;

    // Text nodes
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key=el.getAttribute('data-i18n');
      const attr=el.getAttribute('data-i18n-attr');
      const value=key.split('.').reduce((acc,k)=>acc&&acc[k], dict);
      if(typeof value==='string'){
        if(attr){ el.setAttribute(attr, value); }
        else { el.textContent=value; }
      }
    });

    // Footer year substitution
    document.querySelectorAll('[data-i18n="footer.madeInGalicia"]').forEach(el=>{
      const year=new Date().getFullYear();
      const tpl=dict.footer && dict.footer.madeInGalicia;
      if(tpl){ el.textContent=format(tpl,{year}); }
    });
  }

  function ensureLangSelector(current){
    const container=document.querySelector('.nav-links');
    if(!container) return;
    let wrapper=document.querySelector('.lang-select-wrapper');
    let select=wrapper && wrapper.querySelector('select');
    if(!wrapper){
      wrapper=document.createElement('div');
      wrapper.className='lang-select-wrapper';
      select=document.createElement('select');
      select.className='lang-select';
      select.setAttribute('aria-label','Language');
      select.innerHTML=`
        <option value="gl">GL</option>
        <option value="es">ES</option>
        <option value="en">EN</option>
      `;
      wrapper.appendChild(select);
      // Insert before the first link (left of "El problema")
      const firstLink=container.querySelector('a');
      if(firstLink) container.insertBefore(wrapper, firstLink);
      else container.appendChild(wrapper);
      select.addEventListener('change',()=>{
        const l=select.value;
        try{localStorage.setItem(STORAGE_KEY,l)}catch(_){ }
        applyTranslations(l);
        const url=new URL(window.location.href);
        url.searchParams.set('lang',l);
        window.history.replaceState({},'',url.toString());
      });
    }
    if(select) select.value=current;
  }

  const initial=getInitialLang();
  // Persist URL override for future visits
  const param=getParamLang();
  if(param){ try{ localStorage.setItem(STORAGE_KEY,param) }catch(_){ } }
  ensureLangSelector(initial);
  applyTranslations(initial);
})();

