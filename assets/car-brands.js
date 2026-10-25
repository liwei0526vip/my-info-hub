/* Mainstream passenger-car brands, grouped by brand origin. */
(() => {
  const logoFiles = {
    '比亚迪':'byd-logo.svg','吉利':'geely-logo.svg','上汽名爵':'mg-logo.png','长城汽车':'great-wall-logo.png','奇瑞':'chery-logo.png','蔚来':'nio-logo.png','小鹏':'xpeng-logo.png','理想汽车':'li-auto-logo.svg','红旗':'hongqi-logo.png','广汽埃安':'aion-logo.svg','极氪':'zeekr-logo.png','零跑':'leapmotor-logo.png','问界':'aito-logo.svg','小米汽车':'xiaomi-logo.svg','五菱':'wuling-emblem.svg',
    '丰田':'toyota-logo.svg','雷克萨斯':'lexus-logo.png','本田':'honda-logo.png','日产':'nissan-logo.svg','英菲尼迪':'infiniti-logo.svg','马自达':'mazda-logo.svg','斯巴鲁':'subaru-logo.png','三菱':'mitsubishi-logo.svg','铃木':'suzuki-logo.svg','讴歌':'acura-logo.svg',
    '现代':'hyundai-logo.svg','起亚':'kia-logo.svg','捷尼赛思':'genesis-logo.svg','奔驰':'mercedes-benz-logo.svg','宝马':'bmw-logo.svg','奥迪':'audi-logo.svg','大众':'volkswagen-logo.svg','保时捷':'porsche-logo.svg','欧宝':'opel-logo.svg','迈巴赫':'maybach-logo.png',
    '劳斯莱斯':'rolls-royce-logo.svg','宾利':'bentley-logo.svg','捷豹':'jaguar-logo.svg','路虎':'land-rover-logo.svg','MINI':'mini-logo.svg','阿斯顿·马丁':'aston-martin-logo.svg','莲花':'lotus-logo.svg','迈凯伦':'mclaren-logo.svg',
    '法拉利':'ferrari-logo.svg','兰博基尼':'lamborghini-logo.png','玛莎拉蒂':'maserati-logo.png','阿尔法·罗密欧':'alfa-romeo-logo.svg','菲亚特':'fiat-logo.svg','标致':'peugeot-logo.svg','雪铁龙':'citroen-logo.svg','雷诺':'renault-logo.svg','布加迪':'bugatti-logo.svg',
    '福特':'ford-logo.png','林肯':'lincoln-logo.svg','雪佛兰':'chevrolet-logo.png','凯迪拉克':'cadillac-logo.png','别克':'buick-logo.png','特斯拉':'tesla-logo.svg','Jeep':'jeep-logo.svg','道奇':'dodge-logo.png','克莱斯勒':'chrysler-logo.svg','GMC':'gmc-logo.png','Lucid':'lucid-logo.png','Rivian':'rivian-logo.svg',
    '沃尔沃':'volvo-logo.svg','极星':'polestar-logo.png','柯尼塞格':'koenigsegg-logo.svg','斯柯达':'skoda-logo.svg','西雅特':'seat-logo.svg','Cupra':'cupra-logo.svg','达契亚':'dacia-logo.svg',
  };
  const brands = [
    ['比亚迪','BYD','中国','byd','https://www.byd.com/'],['吉利','Geely','中国','geely','https://www.geely.com/'],['上汽名爵','MG','中国','mg','https://www.mgmotor.com/'],['长城汽车','GWM','中国','greatwallmotors','https://www.gwm-global.com/'],['奇瑞','Chery','中国','chery','https://www.cheryinternational.com/'],['蔚来','NIO','中国','nio','https://www.nio.com/'],['小鹏','XPeng','中国','xiaopeng','https://www.xiaopeng.com/'],['理想汽车','Li Auto','中国','lixiang','https://www.lixiang.com/'],['红旗','Hongqi','中国','', 'https://www.faw.com/'],['广汽埃安','Aion','中国','', 'https://www.aion.com.cn/'],['极氪','Zeekr','中国','zeekr','https://www.zeekrglobal.com/'],['零跑','Leapmotor','中国','', 'https://www.leapmotor.com/'],['问界','AITO','中国','', 'https://aito.auto/'],['小米汽车','Xiaomi Auto','中国','xiaomi','https://www.mi.com/'],['五菱','Wuling','中国','', 'https://www.sgmw.com.cn/'],
    ['丰田','Toyota','日本','toyota','https://www.toyota.com/'],['雷克萨斯','Lexus','日本','lexus','https://www.lexus.com/'],['本田','Honda','日本','honda','https://global.honda/'],['日产','Nissan','日本','nissan','https://www.nissan-global.com/'],['英菲尼迪','Infiniti','日本','infiniti','https://www.infiniti.com/'],['马自达','Mazda','日本','mazda','https://www.mazda.com/'],['斯巴鲁','Subaru','日本','subaru','https://www.subaru.com/'],['三菱','Mitsubishi','日本','mitsubishi','https://www.mitsubishi-motors.com/'],['铃木','Suzuki','日本','suzuki','https://www.globalsuzuki.com/'],['讴歌','Acura','日本','acura','https://www.acura.com/'],
    ['现代','Hyundai','韩国','hyundai','https://www.hyundai.com/'],['起亚','Kia','韩国','kia','https://www.kia.com/'],['捷尼赛思','Genesis','韩国','genesis','https://www.genesis.com/'],
    ['奔驰','Mercedes-Benz','德国','mercedesbenz','https://www.mercedes-benz.com/'],['宝马','BMW','德国','bmw','https://www.bmw.com/'],['奥迪','Audi','德国','audi','https://www.audi.com/'],['大众','Volkswagen','德国','volkswagen','https://www.volkswagen.com/'],['保时捷','Porsche','德国','porsche','https://www.porsche.com/'],['欧宝','Opel','德国','opel','https://www.opel.com/'],['迈巴赫','Mercedes-Maybach','德国','', 'https://www.mercedes-maybach.com/'],
    ['劳斯莱斯','Rolls-Royce','英国','rollsroyce','https://www.rolls-roycemotorcars.com/'],['宾利','Bentley','英国','bentley','https://www.bentleymotors.com/'],['捷豹','Jaguar','英国','jaguar','https://www.jaguar.com/'],['路虎','Land Rover','英国','landrover','https://www.landrover.com/'],['MINI','MINI','英国','mini','https://www.mini.com/'],['阿斯顿·马丁','Aston Martin','英国','astonmartin','https://www.astonmartin.com/'],['莲花','Lotus','英国','lotus','https://www.lotuscars.com/'],['迈凯伦','McLaren','英国','mclaren','https://www.mclaren.com/'],
    ['法拉利','Ferrari','意大利','ferrari','https://www.ferrari.com/'],['兰博基尼','Lamborghini','意大利','lamborghini','https://www.lamborghini.com/'],['玛莎拉蒂','Maserati','意大利','maserati','https://www.maserati.com/'],['阿尔法·罗密欧','Alfa Romeo','意大利','alfaromeo','https://www.alfaromeo.com/'],['菲亚特','Fiat','意大利','fiat','https://www.fiat.com/'],
    ['标致','Peugeot','法国','peugeot','https://www.peugeot.com/'],['雪铁龙','Citroën','法国','citroen','https://www.citroen.com/'],['雷诺','Renault','法国','renault','https://www.renault.com/'],['布加迪','Bugatti','法国','bugatti','https://www.bugatti.com/'],
    ['福特','Ford','美国','ford','https://www.ford.com/'],['林肯','Lincoln','美国','lincoln','https://www.lincoln.com/'],['雪佛兰','Chevrolet','美国','chevrolet','https://www.chevrolet.com/'],['凯迪拉克','Cadillac','美国','cadillac','https://www.cadillac.com/'],['别克','Buick','美国','buick','https://www.buick.com/'],['特斯拉','Tesla','美国','tesla','https://www.tesla.com/'],['Jeep','Jeep','美国','jeep','https://www.jeep.com/'],['道奇','Dodge','美国','dodge','https://www.dodge.com/'],['克莱斯勒','Chrysler','美国','chrysler','https://www.chrysler.com/'],['GMC','GMC','美国','gmc','https://www.gmc.com/'],['Lucid','Lucid','美国','lucidmotors','https://www.lucidmotors.com/'],['Rivian','Rivian','美国','rivian','https://rivian.com/'],
    ['沃尔沃','Volvo','瑞典','volvo','https://www.volvocars.com/'],['极星','Polestar','瑞典','polestar','https://www.polestar.com/'],['柯尼塞格','Koenigsegg','瑞典','koenigsegg','https://www.koenigsegg.com/'],['斯柯达','Škoda','捷克','skoda','https://www.skoda-auto.com/'],['西雅特','SEAT','西班牙','seat','https://www.seat.com/'],['Cupra','CUPRA','西班牙','cupra','https://www.cupraofficial.com/'],['达契亚','Dacia','罗马尼亚','dacia','https://www.dacia.com/'],
  ];
  // Editorial grouping by each brand's main products and overall market positioning.
  const positioningGroups = {
    '中高端': ['小鹏','理想汽车','小米汽车','特斯拉','MINI','别克','Jeep','克莱斯勒','GMC','Cupra'],
    '豪华': ['蔚来','红旗','极氪','问界','雷克萨斯','英菲尼迪','讴歌','捷尼赛思','奔驰','宝马','奥迪','保时捷','捷豹','路虎','莲花','玛莎拉蒂','阿尔法·罗密欧','林肯','凯迪拉克','Lucid','Rivian','沃尔沃','极星'],
    '超豪华': ['迈巴赫','劳斯莱斯','宾利','阿斯顿·马丁','迈凯伦','法拉利','兰博基尼','布加迪','柯尼塞格'],
  };
  const positioningByBrand = new Map(Object.entries(positioningGroups).flatMap(([positioning, names]) => names.map(name => [name, positioning])));
  const tagStyles = { '国产':'domestic', '电动':'electric', '中高端':'premium', '豪华':'luxury', '超豪华':'ultra-luxury' };
  const grid = document.querySelector('#brand-grid');
  const search = document.querySelector('#brand-search');
  const country = document.querySelector('#country-filter');
  const count = document.querySelector('#brand-count');
  const empty = document.querySelector('#brand-empty');
  const tagButtons = [...document.querySelectorAll('[data-tag]')];
  let activeTag = '';
  if (!grid) return;
  [...new Set(brands.map(([, , origin]) => origin))].sort((a,b) => a.localeCompare(b,'zh-CN')).forEach(origin => country.add(new Option(origin, origin)));
  const cards = brands.map(([cn,en,origin,slug,url]) => {
    const card = document.createElement('article'); card.className='brand-card'; card.dataset.origin=origin;
    const imageBox=document.createElement('div'); imageBox.className='brand-mark';
    const logoFile=logoFiles[cn];
    if (logoFile) { const img=document.createElement('img'); img.src=`assets/car-logos/${logoFile}`; img.alt=`${cn}车标`; img.loading='lazy'; img.onerror=()=>{img.remove(); imageBox.textContent='车标';}; imageBox.append(img); }
    else imageBox.textContent='车标';
    const tags = [];
    if (origin === '中国') tags.push('国产');
    if (['比亚迪','蔚来','小鹏','理想汽车','广汽埃安','极氪','零跑','小米汽车','特斯拉','Lucid','Rivian','极星'].includes(cn)) tags.push('电动');
    const positioning = positioningByBrand.get(cn);
    if (positioning) tags.push(positioning);
    card.dataset.tags=tags.join(' ');
    const copy=document.createElement('div'); copy.className='brand-copy';
    const title=document.createElement('h2'); const a=document.createElement('a'); a.href=url; a.target='_blank'; a.rel='noopener noreferrer'; a.textContent=cn; title.append(a);
    copy.append(title);
    const sub=document.createElement('p'); if (origin !== '中国') sub.textContent=origin; if (sub.textContent) copy.append(sub);
    if (tags.length) { const badges=document.createElement('div'); badges.className='brand-tags'; tags.forEach(tag=>{const badge=document.createElement('span');badge.className=`brand-tag brand-tag--${tagStyles[tag]}`;badge.textContent=tag;badges.append(badge);});copy.append(badges); }
    card.append(imageBox,copy);
    card.dataset.search=`${cn} ${origin} ${tags.join(' ')}`.toLocaleLowerCase(); return card;
  });
  grid.append(...cards);
  const filter=()=>{const terms=search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);let shown=0;cards.forEach(card=>{const match=terms.every(term=>card.dataset.search.includes(term))&&(!country.value||card.dataset.origin===country.value)&&(!activeTag||card.dataset.tags.split(' ').includes(activeTag));card.hidden=!match;if(match)shown++;});count.textContent=`显示 ${shown} / ${cards.length} 个品牌`;empty.hidden=shown!==0;};
  search.addEventListener('input',filter); country.addEventListener('change',filter); filter();
  tagButtons.forEach(button=>button.addEventListener('click',()=>{activeTag=button.dataset.tag;tagButtons.forEach(item=>{const active=item===button;item.classList.toggle('is-active',active);item.setAttribute('aria-pressed',String(active));});filter();}));
})();
