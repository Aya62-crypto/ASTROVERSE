const planets = [
  {name:"Mercury",type:"Terrestrial planet",color:"radial-gradient(circle at 35% 28%,#c8c4bd,#77736f 45%,#38363b 78%)",description:"The smallest planet and the closest to the Sun. Mercury has a heavily cratered surface and almost no atmosphere to retain heat.",distance:"57.9 million km",year:"88 Earth days",day:"58.6 Earth days",moons:"0",diameter:"4,879 km",temperature:"167°C average"},
  {name:"Venus",type:"Terrestrial planet",color:"radial-gradient(circle at 35% 25%,#ffe1a0,#c78c4d 50%,#78462e 82%)",description:"A rocky world wrapped in a thick carbon-dioxide atmosphere. Its powerful greenhouse effect makes it the hottest planet.",distance:"108.2 million km",year:"225 Earth days",day:"243 Earth days",moons:"0",diameter:"12,104 km",temperature:"464°C average"},
  {name:"Earth",type:"Terrestrial planet",color:"radial-gradient(circle at 35% 30%,#b4e9ff,#3283c6 40%,#14508c 65%,#17432f 75%)",description:"Our home planet has liquid water on its surface and, as far as we know, is the only world with life. Its atmosphere protects and warms the surface.",distance:"149.6 million km",year:"365.25 days",day:"23 h 56 min",moons:"1",diameter:"12,742 km",temperature:"15°C average"},
  {name:"Mars",type:"Terrestrial planet",color:"radial-gradient(circle at 35% 25%,#ffc18b,#c65e38 48%,#783324 82%)",description:"The Red Planet has giant volcanoes, ancient river valleys, polar ice caps and two small moons: Phobos and Deimos.",distance:"227.9 million km",year:"687 Earth days",day:"24 h 37 min",moons:"2",diameter:"6,779 km",temperature:"−65°C average"},
  {name:"Jupiter",type:"Gas giant",color:"repeating-linear-gradient(8deg,#c99a72 0 13px,#f0d2a9 14px 27px,#9c654c 28px 39px)",description:"The largest planet. Jupiter is a gas giant with powerful storms, including the Great Red Spot, and a huge family of moons.",distance:"778.6 million km",year:"11.86 Earth years",day:"9 h 56 min",moons:"95 confirmed*",diameter:"139,820 km",temperature:"−110°C cloud tops"},
  {name:"Saturn",type:"Gas giant",color:"radial-gradient(circle at 35% 25%,#f5dfa6,#b99760 55%,#756044 82%)",description:"Famous for its spectacular rings, Saturn is a gas giant less dense than water. Its rings are made mostly of countless pieces of ice and rock.",distance:"1.43 billion km",year:"29.4 Earth years",day:"about 10.7 hours",moons:"146 confirmed*",diameter:"116,460 km",temperature:"−140°C cloud tops"},
  {name:"Uranus",type:"Ice giant",color:"radial-gradient(circle at 35% 25%,#d5ffff,#72c9d2 52%,#3b879d 85%)",description:"An ice giant with a blue-green colour caused by methane in its atmosphere. Uranus rotates on its side compared with most planets.",distance:"2.87 billion km",year:"84 Earth years",day:"17 h 14 min",moons:"28 confirmed*",diameter:"50,724 km",temperature:"−195°C average"},
  {name:"Neptune",type:"Ice giant",color:"radial-gradient(circle at 35% 25%,#8bbaff,#315bc4 48%,#172b75 85%)",description:"A distant, cold ice giant with supersonic winds and a deep blue appearance. It takes about 165 Earth years to orbit the Sun.",distance:"4.50 billion km",year:"165 Earth years",day:"16 h 6 min",moons:"16 confirmed*",diameter:"49,244 km",temperature:"−200°C average"}
];

const tabs = document.getElementById("planetTabs");
const detail = document.getElementById("planetDetail");
function showPlanet(index){
  const p=planets[index];
  tabs.innerHTML=planets.map((planet,i)=>`<button class="planet-tab ${i===index?'active':''}" role="tab" aria-selected="${i===index}" data-index="${i}">${planet.name}</button>`).join("");
  detail.innerHTML=`<div class="planet-illustration"><div class="planet-ball" style="background:${p.color}"></div></div><div class="planet-info"><p class="eyebrow">${p.type.toUpperCase()} / PLANET ${String(index+1).padStart(2,"0")}</p><h3>${p.name}</h3><p>${p.description}</p><div class="planet-stats"><div><strong>${p.distance}</strong><small>FROM THE SUN</small></div><div><strong>${p.year}</strong><small>ORBITAL PERIOD</small></div><div><strong>${p.day}</strong><small>ROTATION PERIOD</small></div><div><strong>${p.moons}</strong><small>KNOWN MOONS</small></div><div><strong>${p.diameter}</strong><small>DIAMETER</small></div><div><strong>${p.temperature}</strong><small>TEMPERATURE</small></div></div></div>`;
  tabs.querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>showPlanet(Number(btn.dataset.index))));
}
showPlanet(2);

document.querySelectorAll(".mystery-card").forEach(card=>card.addEventListener("click",()=>{
  document.querySelectorAll(".mystery-card").forEach(c=>c.classList.remove("selected"));
  card.classList.add("selected");
  document.getElementById("mysteryAnswer").textContent=card.dataset.answer;
}));

const gallery=document.getElementById("nasaGallery");
const galleryStatus=document.getElementById("galleryStatus");
let nasaPage=1;
async function loadNasaImages(){
  const terms=["nebula","galaxy","planet","astronaut","space telescope","Saturn"];
  galleryStatus.textContent="Contacting NASA's public image library…";
  try{
    const term=terms[(nasaPage-1)%terms.length];
    const response=await fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(term)}&media_type=image&page=${nasaPage}`);
    if(!response.ok) throw new Error("NASA library request failed");
    const data=await response.json();
    const items=(data.collection.items||[]).filter(item=>item.links?.some(link=>link.rel==="preview")).slice(0,6);
    if(!items.length) throw new Error("No images returned");
    items.forEach(item=>{
      const image=item.links.find(link=>link.rel==="preview");
      const title=(item.data?.[0]?.title||"NASA space image").replaceAll("<","&lt;").replaceAll(">","&gt;");
      const description=(item.data?.[0]?.description||"Explore this image from NASA's public image library.").replace(/<[^>]*>/g,"").slice(0,180).replaceAll("<","&lt;");
      const nasaLink=item.href;
      const card=document.createElement("article");card.className="gallery-item";
      const a=document.createElement("a");a.href=nasaLink;a.target="_blank";a.rel="noopener noreferrer";a.setAttribute("aria-label",`Open NASA source for ${title}`);
      const img=document.createElement("img");img.src=image.href;img.alt=title;img.loading="lazy";
      const content=document.createElement("div");const h=document.createElement("h3");h.textContent=title;const p=document.createElement("p");p.textContent=description;
      a.appendChild(img);content.append(h,p);card.append(a,content);gallery.appendChild(card);
    });
    galleryStatus.textContent="Showing NASA public image-library results. Open an image to view its NASA source.";
    nasaPage++;
  }catch(error){galleryStatus.textContent="NASA images could not load right now. Check your connection or try again.";console.error(error);}
}
loadNasaImages();
document.getElementById("reloadGallery").addEventListener("click",loadNasaImages);

const knowledge=[
  {keys:["black hole","black holes","event horizon","spaghettification"],answer:"A black hole is a region of space where gravity is so strong that nothing can escape from inside its event horizon—not even light. Many form when the cores of massive stars collapse. The event horizon is the boundary beyond which escape is impossible."},
  {keys:["star","stars","sun born","stellar","nebula"],answer:"Stars form inside huge clouds of gas and dust called nebulae. Gravity pulls material together, making the centre hotter and denser. When the core becomes hot enough for nuclear fusion, a star begins shining."},
  {keys:["big bang","universe begin","universe start"],answer:"The Big Bang model says the universe expanded from an extremely hot, dense early state about 13.8 billion years ago. It was not an explosion into empty space: space itself expanded. Evidence includes cosmic expansion and the cosmic microwave background."},
  {keys:["planet","planets","planet form","earth made"],answer:"Planets form in discs of gas and dust around young stars. Tiny solid grains collide and stick together, building larger objects. Over millions of years, these can grow into planets."},
  {keys:["galaxy","galaxies","milky way"],answer:"A galaxy is a huge gravitationally bound system of stars, gas, dust and dark matter. Our Solar System is in the Milky Way, a barred spiral galaxy."},
  {keys:["moon","moons"],answer:"A moon is a natural object that orbits a planet or another smaller body. Moons can form in several ways: from material around a young planet, from giant impacts, or by being captured by gravity."},
  {keys:["solar system","sun"],answer:"Our Solar System formed about 4.6 billion years ago from a collapsing cloud of gas and dust. The Sun formed at the centre, while the remaining material in a rotating disc built the planets and smaller bodies."},
  {keys:["dark matter"],answer:"Dark matter is an unseen form of matter inferred from its gravity. It does not appear to emit, absorb or reflect light like ordinary matter, but it affects how galaxies move and how large-scale cosmic structures form."},
  {keys:["dark energy"],answer:"Dark energy is the name scientists give to whatever is causing the expansion of the universe to accelerate. Its nature is one of the biggest open questions in cosmology."},
  {keys:["life","aliens","extraterrestrial","are we alone"],answer:"No life beyond Earth has been confirmed so far. Scientists search for signs of life by studying Mars, icy moons such as Europa and Enceladus, and the atmospheres of planets orbiting other stars."},
  {keys:["age","how old"],answer:"The universe is about 13.8 billion years old. The Solar System, including the Sun and Earth, formed about 4.6 billion years ago."},
  {keys:["light year","light-year"],answer:"A light-year is a unit of distance, not time. It is how far light travels in one year: about 9.46 trillion kilometres."},
  {keys:["saturn"],answer:"Saturn is a gas giant famous for its rings, which are made mostly of water-ice pieces mixed with rocky material. It has many confirmed moons, and its largest moon, Titan, has lakes and seas of liquid hydrocarbons."},
  {keys:["mars"],answer:"Mars is a cold, rocky planet with a thin carbon-dioxide atmosphere. It has evidence of ancient rivers and lakes, two small moons, and the enormous volcano Olympus Mons."}
];
function getAnswer(question){
  const q=question.toLowerCase();
  const match=knowledge.find(item=>item.keys.some(key=>q.includes(key)));
  return match?match.answer:"Great question! I don't have a specific answer for that in this demo yet. Try asking about the Big Bang, stars, planets, moons, galaxies, black holes, dark matter or life beyond Earth. For deeper research, explore NASA's website and astronomy references.";
}
const chatMessages=document.getElementById("chatMessages");
function addMessage(text,kind){const div=document.createElement("div");div.className=`message ${kind}-message`;div.textContent=text;chatMessages.appendChild(div);chatMessages.scrollTop=chatMessages.scrollHeight;}
function askBot(question){if(!question.trim())return;addMessage(question,"user");setTimeout(()=>addMessage(getAnswer(question),"bot"),250);}
document.getElementById("chatForm").addEventListener("submit",e=>{e.preventDefault();const input=document.getElementById("chatInput");askBot(input.value);input.value="";});
document.querySelectorAll(".suggestions button").forEach(btn=>btn.addEventListener("click",()=>askBot(btn.textContent)));
document.getElementById("clearChat").addEventListener("click",()=>{chatMessages.innerHTML="";addMessage("Conversation cleared! What would you like to explore, explorer?","bot");});

const menuToggle=document.getElementById("menuToggle"),nav=document.getElementById("mainNav");
menuToggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(open));});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menuToggle.setAttribute("aria-expanded","false");}));
const backTop=document.getElementById("backTop");
window.addEventListener("scroll",()=>backTop.classList.toggle("visible",window.scrollY>500));
backTop.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));


// Searchable Cosmic Atlas. Constellation names follow the IAU's official 88.
const atlasData = {
  constellations: [
    ["Andromeda","Northern","Contains the Andromeda Galaxy (M31), visible to the naked eye under dark skies."],
    ["Antlia","Southern","A faint southern constellation; its name means air pump."],
    ["Apus","Southern","A small southern constellation representing a bird of paradise."],
    ["Aquarius","Zodiac","A zodiac constellation in a region rich with globular clusters and planetary nebulae."],
    ["Aquila","Equatorial","Home to the bright star Altair, part of the Summer Triangle."],
    ["Ara","Southern","A southern constellation representing an altar."],
    ["Aries","Zodiac","A zodiac constellation; its name means the ram."],
    ["Auriga","Northern","Contains Capella, one of the brightest stars in the night sky."],
    ["Boötes","Northern","Home to Arcturus, a brilliant orange giant star."],
    ["Caelum","Southern","A small, faint constellation representing a chisel."],
    ["Camelopardalis","Northern","A large but faint northern constellation."],
    ["Cancer","Zodiac","A zodiac constellation containing the Beehive Cluster (M44)."],
    ["Canes Venatici","Northern","Contains the famous Whirlpool Galaxy (M51) nearby in the sky."],
    ["Canis Major","Equatorial","Home to Sirius, the brightest star in Earth's night sky."],
    ["Canis Minor","Equatorial","Contains Procyon, one of the stars of the Winter Triangle."],
    ["Capricornus","Zodiac","A zodiac constellation traditionally represented by a sea-goat."],
    ["Carina","Southern","Contains Canopus and the spectacular Carina Nebula."],
    ["Cassiopeia","Northern","Recognisable by its W-shaped pattern; contains the supernova remnant Cassiopeia A."],
    ["Centaurus","Southern","Contains Alpha Centauri, the nearest star system to the Solar System."],
    ["Cepheus","Northern","Contains the Garnet Star and variable stars important to astronomy."],
    ["Cetus","Equatorial","A large constellation containing the variable star Mira."],
    ["Chamaeleon","Southern","A small southern constellation near the south celestial pole."],
    ["Circinus","Southern","A small southern constellation; its name means compasses."],
    ["Columba","Southern","A faint southern constellation representing a dove."],
    ["Coma Berenices","Northern","Contains the Coma Star Cluster and lies in a rich galaxy region."],
    ["Corona Australis","Southern","A small southern constellation with a region of star formation."],
    ["Corona Borealis","Northern","A semicircle of stars known as the Northern Crown."],
    ["Corvus","Southern","A compact constellation representing a crow."],
    ["Crater","Southern","A faint constellation representing a cup."],
    ["Crux","Southern","The Southern Cross, a well-known guide to the south celestial pole."],
    ["Cygnus","Northern","Contains Deneb, the North America Nebula and the Cygnus X-1 black-hole candidate."],
    ["Delphinus","Northern","A small, recognisable constellation representing a dolphin."],
    ["Dorado","Southern","Contains part of the Large Magellanic Cloud and the Tarantula Nebula."],
    ["Draco","Northern","A long constellation winding around the north celestial pole."],
    ["Equuleus","Northern","One of the smallest constellations; its name means little horse."],
    ["Eridanus","Equatorial","A long river-shaped constellation containing the star Achernar."],
    ["Fornax","Southern","Contains the Fornax Cluster, a rich collection of galaxies."],
    ["Gemini","Zodiac","Contains the bright stars Castor and Pollux."],
    ["Grus","Southern","A southern constellation representing a crane."],
    ["Hercules","Northern","Contains the Great Hercules Globular Cluster (M13)."],
    ["Horologium","Southern","A faint constellation representing a pendulum clock."],
    ["Hydra","Equatorial","The largest of the 88 constellations by area."],
    ["Hydrus","Southern","A small southern constellation representing a water snake."],
    ["Indus","Southern","A faint southern constellation representing an Indigenous figure in older European sky maps."],
    ["Lacerta","Northern","A faint northern constellation between Cygnus and Andromeda."],
    ["Leo","Zodiac","Contains Regulus and the Leo Triplet of galaxies."],
    ["Leo Minor","Northern","A small northern constellation near the larger Leo."],
    ["Lepus","Equatorial","A constellation below Orion, representing a hare."],
    ["Libra","Zodiac","A zodiac constellation representing scales."],
    ["Lupus","Southern","A southern constellation representing a wolf."],
    ["Lynx","Northern","A faint constellation; its stars require sharp eyesight in dark skies."],
    ["Lyra","Northern","Contains Vega, one of the brightest stars in the sky."],
    ["Mensa","Southern","Contains part of the Large Magellanic Cloud."],
    ["Microscopium","Southern","A faint southern constellation representing a microscope."],
    ["Monoceros","Equatorial","Contains the Rosette Nebula and the Christmas Tree Cluster."],
    ["Musca","Southern","A small constellation near the Southern Cross."],
    ["Norma","Southern","A faint southern constellation representing a carpenter's square."],
    ["Octans","Southern","Contains the south celestial pole; Sigma Octantis is the pole star there."],
    ["Ophiuchus","Equatorial","A large constellation representing a serpent-bearer; it contains Barnard's Star."],
    ["Orion","Equatorial","Contains Betelgeuse, Rigel, Bellatrix and the Orion Nebula."],
    ["Pavo","Southern","Contains the star Peacock (Alpha Pavonis)."],
    ["Pegasus","Northern","Recognisable by the Great Square; contains the Pegasus Cluster of galaxies."],
    ["Perseus","Northern","Contains the Double Cluster and the variable star Algol."],
    ["Phoenix","Southern","A southern constellation representing the mythical bird."],
    ["Pictor","Southern","Contains the star Beta Pictoris, known to host a planetary system."],
    ["Pisces","Zodiac","A zodiac constellation representing two fish."],
    ["Piscis Austrinus","Southern","Contains Fomalhaut, a bright star with a debris disc."],
    ["Puppis","Southern","Part of the former constellation Argo Navis; contains several star clusters."],
    ["Pyxis","Southern","A small southern constellation representing a mariner's compass."],
    ["Reticulum","Southern","A small southern constellation near the Large Magellanic Cloud."],
    ["Sagitta","Northern","One of the smallest constellations; its name means arrow."],
    ["Sagittarius","Zodiac","Points toward the Milky Way's centre and contains the Lagoon and Trifid Nebulae."],
    ["Scorpius","Zodiac","Contains the red supergiant Antares and the Butterfly Cluster."],
    ["Sculptor","Southern","Contains the Sculptor Galaxy (NGC 253) and the Sculptor Group."],
    ["Scutum","Equatorial","Contains the Wild Duck Cluster (M11)."],
    ["Serpens","Equatorial","The only constellation split into two separate sky regions: Caput and Cauda."],
    ["Sextans","Equatorial","A faint constellation near Leo and Hydra."],
    ["Taurus","Zodiac","Contains Aldebaran, the Hyades and the Pleiades."],
    ["Telescopium","Southern","A faint southern constellation representing a telescope."],
    ["Triangulum","Northern","Contains the Triangulum Galaxy (M33), a member of the Local Group."],
    ["Triangulum Australe","Southern","A compact southern constellation forming a bright triangle."],
    ["Tucana","Southern","Contains the Small Magellanic Cloud and 47 Tucanae globular cluster."],
    ["Ursa Major","Northern","Contains the Big Dipper asterism and the galaxies M81 and M82."],
    ["Ursa Minor","Northern","Contains Polaris, the current North Star."],
    ["Vela","Southern","Part of the former Argo Navis; contains the Vela supernova remnant."],
    ["Virgo","Zodiac","Contains Spica and the Virgo Cluster, a major nearby galaxy cluster."],
    ["Volans","Southern","A small southern constellation representing a flying fish."],
    ["Vulpecula","Northern","Contains the Dumbbell Nebula (M27), a famous planetary nebula."]
  ],
  stars: [
    ["Sun","G-type main-sequence star","The star at the centre of our Solar System; about 4.6 billion years old."],
    ["Sirius","A-type main-sequence star + white dwarf","Brightest star in the night sky; a binary system in Canis Major."],
    ["Canopus","F-type bright giant","One of the brightest stars in the night sky, in Carina."],
    ["Alpha Centauri A","G-type main-sequence star","A Sun-like star in the nearest stellar system to the Sun."],
    ["Alpha Centauri B","K-type main-sequence star","The companion star to Alpha Centauri A."],
    ["Proxima Centauri","Red dwarf","The nearest known individual star to the Sun; hosts known exoplanets."],
    ["Arcturus","Red giant","A bright orange giant in Boötes."],
    ["Vega","A-type main-sequence star","A bright star in Lyra; one point of the Summer Triangle."],
    ["Capella","Giant-star multiple system","A system in Auriga containing two giant stars."],
    ["Rigel","Blue supergiant","A luminous star marking Orion's foot."],
    ["Betelgeuse","Red supergiant","A variable red supergiant in Orion."],
    ["Achernar","Hot blue star","A rapidly rotating star in Eridanus."],
    ["Betelgeuse","Red supergiant","A famous variable star in Orion."],
    ["Hadar (Beta Centauri)","Blue giant system","A bright multiple-star system in Centaurus."],
    ["Altair","A-type main-sequence star","A fast-rotating star in Aquila."],
    ["Acrux","Multiple star system","The brightest star in the Southern Cross, Crux."],
    ["Aldebaran","Orange giant","The bright eye of Taurus."],
    ["Antares","Red supergiant","A red supergiant in Scorpius."],
    ["Spica","Blue-white binary star","The brightest star in Virgo."],
    ["Pollux","Orange giant","The brighter of the two Gemini twins."],
    ["Castor","Multiple-star system","A complex system of stars in Gemini."],
    ["Fomalhaut","A-type main-sequence star","A bright star in Piscis Austrinus with a debris disc."],
    ["Deneb","White supergiant","A very luminous star in Cygnus."],
    ["Regulus","Multiple-star system","The brightest star in Leo."],
    ["Polaris","Multiple-star system","The current North Star, in Ursa Minor."],
    ["Mira","Pulsating red giant","A famous long-period variable star in Cetus."],
    ["Algol","Eclipsing binary system","A famous eclipsing binary in Perseus."],
    ["Barnard's Star","Red dwarf","A nearby high-proper-motion star in Ophiuchus."],
    ["Tau Ceti","G-type main-sequence star","A nearby Sun-like star in Cetus."],
    ["Epsilon Eridani","K-type main-sequence star","A nearby star with a debris disc and planetary candidate."],
    ["TRAPPIST-1","Ultra-cool red dwarf","A small star with seven known roughly Earth-sized planets."],
    ["Kepler-22","G-type star","Hosts Kepler-22b, an exoplanet in the habitable zone."],
    ["51 Pegasi","Sun-like star","Hosts 51 Pegasi b, the first exoplanet discovered around a Sun-like star."],
    ["Tabby's Star","F-type star","Known for unusual, irregular dips in brightness."],
    ["UY Scuti","Red supergiant candidate","A very large star; exact size estimates are uncertain."],
    ["R136a1","Very massive star","An extremely massive, luminous star in the Tarantula Nebula region."],
    ["Eta Carinae","Massive stellar system","A luminous, unstable system surrounded by the Homunculus Nebula."]
  ],
  galaxies: [
    ["Milky Way","Barred spiral galaxy","Our home galaxy; the Solar System lies in the Orion Arm region."],
    ["Andromeda Galaxy (M31)","Spiral galaxy","The nearest large spiral galaxy to the Milky Way."],
    ["Triangulum Galaxy (M33)","Spiral galaxy","A member of the Local Group, in the constellation Triangulum."],
    ["Large Magellanic Cloud","Dwarf irregular galaxy","A satellite galaxy of the Milky Way, rich in star-forming regions."],
    ["Small Magellanic Cloud","Dwarf irregular galaxy","A nearby satellite galaxy visible from the Southern Hemisphere."],
    ["Messier 87 (M87)","Giant elliptical galaxy","A giant galaxy whose central black hole was imaged by the Event Horizon Telescope."],
    ["Whirlpool Galaxy (M51)","Interacting spiral galaxy","A grand-design spiral interacting with a smaller companion."],
    ["Sombrero Galaxy (M104)","Unusual spiral galaxy","Known for its bright central bulge and prominent dust lane."],
    ["Pinwheel Galaxy (M101)","Face-on spiral galaxy","A large spiral galaxy with many bright star-forming regions."],
    ["Bode's Galaxy (M81)","Spiral galaxy","A bright galaxy in Ursa Major."],
    ["Cigar Galaxy (M82)","Starburst galaxy","A galaxy undergoing intense star formation, interacting with M81."],
    ["Centaurus A (NGC 5128)","Peculiar galaxy","A nearby galaxy with a striking dust lane and radio jets."],
    ["Sculptor Galaxy (NGC 253)","Starburst spiral galaxy","A bright nearby galaxy in Sculptor."],
    ["Cartwheel Galaxy","Ring galaxy","A dramatic ring-shaped galaxy likely shaped by a collision."],
    ["Hoag's Object","Ring galaxy","A rare galaxy with a nearly circular ring around a central core."],
    ["Tadpole Galaxy","Interacting galaxy","A galaxy with a long tidal tail of stars and gas."],
    ["Antennae Galaxies","Interacting galaxy pair","Two colliding galaxies with intense star formation."],
    ["Messier 60","Elliptical galaxy","A massive elliptical galaxy in the Virgo Cluster."],
    ["Messier 49","Elliptical galaxy","One of the brightest galaxies in the Virgo Cluster."],
    ["NGC 1300","Barred spiral galaxy","A classic example of a strongly barred spiral."],
    ["NGC 1365","Barred spiral galaxy","A large barred spiral in the Fornax Cluster."],
    ["NGC 2535","Interacting spiral galaxy","A galaxy showing tidal effects from a companion."],
    ["IC 1101","Supergiant elliptical galaxy","An enormous galaxy in the Abell 2029 cluster; size estimates depend on definition."],
    ["Dragonfly 44","Ultra-diffuse galaxy","A faint galaxy studied for its unusual dark-matter content."],
    ["Segue 1","Ultra-faint dwarf galaxy candidate","An extremely faint satellite system near the Milky Way."],
    ["Leo I","Dwarf spheroidal galaxy","A satellite galaxy of the Milky Way."],
    ["Fornax Dwarf Galaxy","Dwarf spheroidal galaxy","A satellite of the Milky Way containing several globular clusters."],
    ["Barnard's Galaxy (NGC 6822)","Irregular dwarf galaxy","A nearby Local Group galaxy."],
    ["IC 342","Spiral galaxy","A nearby spiral galaxy partly obscured by dust in the Milky Way."],
    ["NGC 2403","Spiral galaxy","A nearby spiral in the M81 group."],
    ["NGC 55","Barred irregular galaxy","A prominent galaxy in the Sculptor Group."],
    ["NGC 300","Spiral galaxy","A nearby face-on spiral in the Sculptor Group."],
    ["NGC 4038","Interacting galaxy","One of the Antennae Galaxies."],
    ["NGC 4039","Interacting galaxy","The companion galaxy in the Antennae pair."]
  ],
  moons: [
    ["Moon (Luna)","Earth","Earth's only natural satellite; its phases result from changing Sun-Earth-Moon geometry."],
    ["Phobos","Mars","The larger and closer of Mars's two small moons; it is slowly moving inward."],
    ["Deimos","Mars","The smaller, more distant moon of Mars."],
    ["Io","Jupiter","The most volcanically active world known, powered by tidal heating."],
    ["Europa","Jupiter","An icy moon with strong evidence for a global subsurface ocean."],
    ["Ganymede","Jupiter","The largest moon in the Solar System; it has its own magnetic field."],
    ["Callisto","Jupiter","A heavily cratered moon that may contain a deep salty ocean."],
    ["Amalthea","Jupiter","A small, irregular inner moon of Jupiter."],
    ["Himalia","Jupiter","The largest member of a group of irregular Jovian moons."],
    ["Mimas","Saturn","A small icy moon with the enormous Herschel crater."],
    ["Enceladus","Saturn","Shoots water-rich plumes into space and has a subsurface ocean."],
    ["Tethys","Saturn","An icy moon marked by the huge Odysseus crater."],
    ["Dione","Saturn","An icy moon with cliffs and evidence of geological activity."],
    ["Rhea","Saturn","Saturn's second-largest moon."],
    ["Titan","Saturn","A thick-atmosphere moon with lakes and seas of liquid methane and ethane."],
    ["Iapetus","Saturn","Known for a dramatic two-tone surface and an equatorial ridge."],
    ["Hyperion","Saturn","A porous, irregular moon with a sponge-like appearance."],
    ["Phoebe","Saturn","A distant irregular moon thought to be a captured object."],
    ["Miranda","Uranus","A small moon with dramatic cliffs and patchwork terrain."],
    ["Ariel","Uranus","An icy moon with valleys and signs of past resurfacing."],
    ["Umbriel","Uranus","A dark, heavily cratered moon."],
    ["Titania","Uranus","The largest moon of Uranus."],
    ["Oberon","Uranus","A distant, cratered moon of Uranus."],
    ["Triton","Neptune","A large captured moon with nitrogen geysers and a retrograde orbit."],
    ["Nereid","Neptune","A moon with an unusually elongated orbit."],
    ["Proteus","Neptune","A large irregular moon with a heavily cratered surface."],
    ["Charon","Pluto","Pluto's largest moon; Pluto and Charon orbit a shared centre of mass."],
    ["Nix","Pluto","A small irregular moon of Pluto."],
    ["Hydra","Pluto","A small outer moon of Pluto."],
    ["Kerberos","Pluto","A small moon discovered by the Hubble Space Telescope."],
    ["Styx","Pluto","The smallest known moon of Pluto."],
    ["Dysnomia","Eris","The known moon of the dwarf planet Eris."],
    ["Hiʻiaka","Haumea","A moon of the rapidly rotating dwarf planet Haumea."],
    ["Namaka","Haumea","The smaller known moon of Haumea."],
    ["Vanth","Orcus","A moon orbiting the trans-Neptunian dwarf-planet candidate Orcus."]
  ],
  systems: [
    ["Solar System","Sun","Our system contains eight planets, dwarf planets, moons, asteroids, comets and icy bodies."],
    ["Alpha Centauri system","Alpha Centauri A, B and Proxima Centauri","The nearest stellar system; Proxima Centauri hosts at least two confirmed planets."],
    ["TRAPPIST-1 system","TRAPPIST-1","Seven known Earth-sized planets orbit an ultra-cool dwarf star."],
    ["Kepler-90 system","Kepler-90","A system known for eight confirmed planets, matching the Solar System's planet count."],
    ["Kepler-11 system","Kepler-11","A compact system with multiple transiting planets."],
    ["51 Pegasi system","51 Pegasi","Hosts 51 Pegasi b, a famous hot Jupiter."],
    ["Proxima Centauri system","Proxima Centauri","Includes Proxima b and the candidate/confirmed status of additional worlds has been studied."],
    ["HR 8799 system","HR 8799","Hosts directly imaged giant planets."],
    ["Fomalhaut system","Fomalhaut","Known for a debris disc and candidate planetary bodies."],
    ["Beta Pictoris system","Beta Pictoris","A young planetary system with directly imaged giant planets and a debris disc."],
    ["TOI-700 system","TOI-700","Includes several small planets, including TOI-700 d and e."],
    ["LHS 1140 system","LHS 1140","A nearby red dwarf with transiting planets, including a temperate-zone world."],
    ["55 Cancri system","55 Cancri A","A multi-planet system with a hot super-Earth and giant planets."],
    ["Upsilon Andromedae system","Upsilon Andromedae","One of the first known multi-planet systems around a Sun-like star."],
    ["Gliese 581 system","Gliese 581","A nearby red dwarf system; some historically reported planets remain disputed."],
    ["WASP-12 system","WASP-12","Hosts an extremely hot gas giant, WASP-12b."],
    ["HD 189733 system","HD 189733","Hosts a hot Jupiter studied in detail by transit observations."],
    ["K2-18 system","K2-18","Hosts K2-18 b, a sub-Neptune whose atmosphere has been studied."],
    ["Kepler-16 system","Kepler-16 A and B","A circumbinary planet orbits two stars, like the fictional Tatooine concept."],
    ["Kepler-452 system","Kepler-452","Hosts Kepler-452b, a planet candidate/confirmed planet often compared with Earth."]
  ],
  nebulae: [
    ["Orion Nebula (M42)","Emission nebula","A nearby stellar nursery visible to the naked eye under dark skies."],
    ["Carina Nebula","Emission nebula","A vast star-forming region containing massive young stars."],
    ["Eagle Nebula (M16)","Emission nebula","Home to the famous Pillars of Creation."],
    ["Crab Nebula (M1)","Supernova remnant","Expanding debris from a supernova observed in 1054 CE."],
    ["Ring Nebula (M57)","Planetary nebula","A glowing shell of gas expelled by a dying Sun-like star."],
    ["Helix Nebula","Planetary nebula","A nearby planetary nebula sometimes called the Eye of God."],
    ["Lagoon Nebula (M8)","Emission nebula","A large star-forming region in Sagittarius."],
    ["Trifid Nebula (M20)","Emission/reflection nebula","A colourful nebula divided by dark dust lanes."],
    ["Rosette Nebula","Emission nebula","A large cloud of gas around an open star cluster."],
    ["Horsehead Nebula","Dark nebula","A dark dust cloud silhouetted against glowing gas in Orion."],
    ["North America Nebula","Emission nebula","A nebula in Cygnus whose outline resembles North America."],
    ["Tarantula Nebula","Star-forming region","An exceptionally active star-forming region in the Large Magellanic Cloud."],
    ["Veil Nebula","Supernova remnant","A large network of glowing filaments left by a stellar explosion."],
    ["Dumbbell Nebula (M27)","Planetary nebula","A bright planetary nebula in Vulpecula."],
    ["Bubble Nebula","Emission nebula","A bubble-shaped shell blown by a massive star's stellar wind."]
  ]
};

const atlasCategory = document.getElementById("atlasCategory");
const atlasSearch = document.getElementById("atlasSearch");
const atlasGrid = document.getElementById("atlasGrid");
const atlasCount = document.getElementById("atlasCount");
function renderAtlas() {
  if (!atlasGrid) return;
  const category = atlasCategory.value;
  const query = atlasSearch.value.trim().toLowerCase();
  const rows = atlasData[category].filter(row => row.join(" ").toLowerCase().includes(query));
  atlasCount.textContent = `${rows.length} ${category === "constellations" ? "of 88 constellations" : "catalogue entries"}`;
  atlasGrid.innerHTML = rows.length ? rows.map((row, i) => `
    <article class="atlas-card">
      <span class="atlas-type">${category === "constellations" ? row[1] + " constellation" : category.slice(0,-1)}</span>
      <h3>${row[0]}</h3><p>${row[2]}</p>
      <small class="atlas-meta">${category === "moons" ? "Orbits: " + row[1] : category === "systems" ? "Host: " + row[1] : category === "stars" ? row[1] : category === "galaxies" || category === "nebulae" ? row[1] : "Official constellation region"}</small>
    </article>`).join("") : `<div class="atlas-empty">No matching objects found. Try another spelling or choose a different collection.</div>`;
}
if (atlasCategory && atlasSearch) {
  atlasCategory.addEventListener("change", renderAtlas);
  atlasSearch.addEventListener("input", renderAtlas);
  renderAtlas();
}
