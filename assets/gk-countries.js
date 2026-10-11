/* Country reference: dense single table with search, region filter and sorting. */
const COUNTRIES = [
  {"n":"印度","e":"India","c":"IN","cap":"新德里","r":"亚洲","a":3287590,"p":1450935791,"g":3760813470500.86,"mr":4,"mi":0.12},
  {"n":"中国","e":"China","c":"CN","cap":"北京","r":"亚洲","a":9706961,"p":1408975000,"g":18729668435848,"mr":3,"mi":0.08},
  {"n":"美国","e":"United States","c":"US","cap":"华盛顿","r":"北美洲","a":9372610,"p":340003797,"g":29298013000000,"mr":1,"mi":0.07},
  {"n":"印度尼西亚","e":"Indonesia","c":"ID","cap":"雅加达","r":"亚洲","a":1904569,"p":283487931,"g":1396301788461.69,"mr":13,"mi":0.26},
  {"n":"巴基斯坦","e":"Pakistan","c":"PK","cap":"伊斯兰堡","r":"亚洲","a":881912,"p":251269164,"g":371747087751.306,"mr":12,"mi":0.25},
  {"n":"尼日利亚","e":"Nigeria","c":"NG","cap":"阿布贾","r":"非洲","a":923768,"p":232679478,"g":252261880140.271,"mr":31,"mi":0.58},
  {"n":"巴西","e":"Brazil","c":"BR","cap":"巴西利亚","r":"南美洲","a":8515767,"p":211998573,"g":2185821610689.31,"mr":11,"mi":0.24},
  {"n":"孟加拉国","e":"Bangladesh","c":"BD","cap":"达卡","r":"亚洲","a":147570,"p":173562364,"g":450119432068.852,"mr":35,"mi":0.61},
  {"n":"俄罗斯","e":"Russia","c":"RU","cap":"莫斯科","r":"欧洲","a":17098242,"p":143669648,"g":2186462268813.08,"mr":2,"mi":0.08},
  {"n":"埃塞俄比亚","e":"Ethiopia","c":"ET","cap":"亚的斯亚贝巴","r":"非洲","a":1104300,"p":132059767,"g":149740297952.375,"mr":null,"mi":null},
  {"n":"墨西哥","e":"Mexico","c":"MX","cap":"墨西哥城","r":"北美洲","a":1964375,"p":130861007,"g":1830489311088.89,"mr":32,"mi":0.6},
  {"n":"日本","e":"Japan","c":"JP","cap":"东京","r":"亚洲","a":377930,"p":123975371,"g":4190008188358.57,"mr":7,"mi":0.18},
  {"n":"埃及","e":"Egypt","c":"EG","cap":"开罗","r":"非洲","a":1002450,"p":116538258,"g":389059910593.1,"mr":19,"mi":0.34},
  {"n":"菲律宾","e":"Philippines","c":"PH","cap":"马尼拉","r":"亚洲","a":342353,"p":115843670,"g":461671157904.74,"mr":41,"mi":0.7},
  {"n":"刚果（金）","e":"DR Congo","c":"CD","cap":"金沙萨","r":"非洲","a":2344858,"p":109276265,"g":75716176105.0704,"mr":null,"mi":null},
  {"n":"越南","e":"Vietnam","c":"VN","cap":"河内","r":"亚洲","a":331212,"p":100987686,"g":476324572783.807,"mr":24,"mi":0.4},
  {"n":"伊朗","e":"Iran","c":"IR","cap":"德黑兰","r":"亚洲","a":1648195,"p":91567738,"g":475252089215.416,"mr":16,"mi":0.3},
  {"n":"土耳其","e":"Türkiye","c":"TR","cap":"安卡拉","r":"亚洲","a":783562,"p":85518661,"g":1359123768774.12,"mr":9,"mi":0.19},
  {"n":"德国","e":"Germany","c":"DE","cap":"柏林","r":"欧洲","a":357114,"p":83516593,"g":4685592577804.69,"mr":14,"mi":0.26},
  {"n":"泰国","e":"Thailand","c":"TH","cap":"曼谷","r":"亚洲","a":513120,"p":71668011,"g":529385520941.539,"mr":26,"mi":0.45},
  {"n":"英国","e":"United Kingdom","c":"GB","cap":"伦敦","r":"欧洲","a":242900,"p":69281000,"g":3695539513534.15,"mr":6,"mi":0.18},
  {"n":"坦桑尼亚","e":"Tanzania","c":"TZ","cap":"多多马","r":"非洲","a":945087,"p":68560157,"g":79235713444.9777,"mr":null,"mi":null},
  {"n":"法国","e":"France","c":"FR","cap":"巴黎","r":"欧洲","a":551695,"p":68551653,"g":3160442622465.08,"mr":8,"mi":0.19},
  {"n":"南非","e":"South Africa","c":"ZA","cap":"比勒陀利亚","r":"非洲","a":1221037,"p":64007187,"g":401144998373.585,"mr":40,"mi":0.69},
  {"n":"意大利","e":"Italy","c":"IT","cap":"罗马","r":"欧洲","a":301336,"p":58952704,"g":2383435562458.12,"mr":10,"mi":0.22},
  {"n":"肯尼亚","e":"Kenya","c":"KE","cap":"内罗毕","r":"非洲","a":580367,"p":56432944,"g":120397537849.826,"mr":null,"mi":null},
  {"n":"缅甸","e":"Myanmar","c":"MM","cap":"内比都","r":"亚洲","a":676578,"p":54500091,"g":74068349523.8095,"mr":37,"mi":0.67},
  {"n":"哥伦比亚","e":"Colombia","c":"CO","cap":"波哥大","r":"南美洲","a":1141748,"p":52886363,"g":420504033143.211,"mr":46,"mi":0.84},
  {"n":"韩国","e":"South Korea","c":"KR","cap":"首尔","r":"亚洲","a":100210,"p":51751065,"g":1875388209406.8,"mr":5,"mi":0.17},
  {"n":"苏丹","e":"Sudan","c":"SD","cap":"喀土穆","r":"非洲","a":1886068,"p":50448963,"g":49672435513.1126,"mr":null,"mi":null},
  {"n":"乌干达","e":"Uganda","c":"UG","cap":"坎帕拉","r":"非洲","a":241550,"p":50015092,"g":53911907079.0485,"mr":null,"mi":null},
  {"n":"西班牙","e":"Spain","c":"ES","cap":"马德里","r":"欧洲","a":505992,"p":48848840,"g":1725671652742.19,"mr":17,"mi":0.32},
  {"n":"阿尔及利亚","e":"Algeria","c":"DZ","cap":"阿尔及尔","r":"非洲","a":2381741,"p":46814308,"g":269322281664.773,"mr":20,"mi":0.36},
  {"n":"伊拉克","e":"Iraq","c":"IQ","cap":"巴格达","r":"亚洲","a":438317,"p":46042015,"g":279641257615.385,"mr":43,"mi":0.77},
  {"n":"阿根廷","e":"Argentina","c":"AR","cap":"布宜诺斯艾利斯","r":"南美洲","a":2780400,"p":45696159,"g":638365455340.04,"mr":33,"mi":0.6},
  {"n":"阿富汗","e":"Afghanistan","c":"AF","cap":"喀布尔","r":"亚洲","a":652230,"p":42647492,"g":17778508875.7396,"mr":null,"mi":null},
  {"n":"加拿大","e":"Canada","c":"CA","cap":"渥太华","r":"北美洲","a":9984670,"p":41262329,"g":2270076189683.46,"mr":28,"mi":0.52},
  {"n":"也门","e":"Yemen","c":"YE","cap":"萨那","r":"亚洲","a":527968,"p":40583164,"g":null,"mr":null,"mi":null},
  {"n":"摩洛哥","e":"Morocco","c":"MA","cap":"拉巴特","r":"非洲","a":446550,"p":38081173,"g":160610994054.734,"mr":null,"mi":null},
  {"n":"安哥拉","e":"Angola","c":"AO","cap":"罗安达","r":"非洲","a":1246700,"p":37885849,"g":103080538044.058,"mr":null,"mi":null},
  {"n":"乌克兰","e":"Ukraine","c":"UA","cap":"基辅","r":"欧洲","a":603500,"p":37860221,"g":190833835445.1,"mr":21,"mi":0.38},
  {"n":"波兰","e":"Poland","c":"PL","cap":"华沙","r":"欧洲","a":312679,"p":36559233,"g":917767106146.761,"mr":22,"mi":0.38},
  {"n":"乌兹别克斯坦","e":"Uzbekistan","c":"UZ","cap":"塔什干","r":"亚洲","a":447400,"p":36361859,"g":121356065241.228,"mr":null,"mi":null},
  {"n":"马来西亚","e":"Malaysia","c":"MY","cap":"吉隆坡","r":"亚洲","a":330803,"p":35557673,"g":422227005428.688,"mr":42,"mi":0.74},
  {"n":"沙特阿拉伯","e":"Saudi Arabia","c":"SA","cap":"利雅得","r":"亚洲","a":2149690,"p":35300280,"g":1254140800000,"mr":25,"mi":0.42},
  {"n":"莫桑比克","e":"Mozambique","c":"MZ","cap":"马普托","r":"非洲","a":801590,"p":34631766,"g":22752244245.473,"mr":null,"mi":null},
  {"n":"加纳","e":"Ghana","c":"GH","cap":"阿克拉","r":"非洲","a":238533,"p":34427414,"g":83288585604.0268,"mr":null,"mi":null},
  {"n":"秘鲁","e":"Peru","c":"PE","cap":"利马","r":"南美洲","a":1285216,"p":34217848,"g":291751523018.903,"mr":49,"mi":0.86},
  {"n":"马达加斯加","e":"Madagascar","c":"MG","cap":"塔那那利佛","r":"非洲","a":587041,"p":31964956,"g":17592832696.1336,"mr":null,"mi":null},
  {"n":"科特迪瓦","e":"Ivory Coast","c":"CI","cap":"亚穆苏克罗","r":"非洲","a":322463,"p":31934230,"g":87113179149.284,"mr":null,"mi":null},
  {"n":"尼泊尔","e":"Nepal","c":"NP","cap":"加德满都","r":"亚洲","a":147181,"p":29651054,"g":43298911699.9284,"mr":null,"mi":null},
  {"n":"喀麦隆","e":"Cameroon","c":"CM","cap":"雅温得","r":"非洲","a":475442,"p":29123744,"g":53296694320.2057,"mr":null,"mi":null},
  {"n":"委内瑞拉","e":"Venezuela","c":"VE","cap":"加拉加斯","r":"南美洲","a":916445,"p":28405543,"g":120566112397.063,"mr":50,"mi":0.89},
  {"n":"澳大利亚","e":"Australia","c":"AU","cap":"堪培拉","r":"大洋洲","a":7692024,"p":27194286,"g":1757022451652.83,"mr":18,"mi":0.33},
  {"n":"尼日尔","e":"Niger","c":"NE","cap":"尼亚美","r":"非洲","a":1267000,"p":27032412,"g":19729786046.7618,"mr":null,"mi":null},
  {"n":"朝鲜","e":"North Korea","c":"KP","cap":"平壤","r":"亚洲","a":120538,"p":26498823,"g":null,"mr":34,"mi":0.6},
  {"n":"叙利亚","e":"Syria","c":"SY","cap":"大马士革","r":"亚洲","a":185180,"p":24672760,"g":null,"mr":null,"mi":null},
  {"n":"马里","e":"Mali","c":"ML","cap":"巴马科","r":"非洲","a":1240192,"p":24478595,"g":26761281076.7658,"mr":null,"mi":null},
  {"n":"布基纳法索","e":"Burkina Faso","c":"BF","cap":"瓦加杜古","r":"非洲","a":272967,"p":23548781,"g":23136514855.7646,"mr":null,"mi":null},
  {"n":"斯里兰卡","e":"Sri Lanka","c":"LK","cap":"斯里贾亚瓦德纳普拉科特","r":"亚洲","a":65610,"p":21916000,"g":99616111265.7633,"mr":null,"mi":null},
  {"n":"马拉维","e":"Malawi","c":"MW","cap":"利隆圭","r":"非洲","a":118484,"p":21655286,"g":11311971400.3864,"mr":null,"mi":null},
  {"n":"赞比亚","e":"Zambia","c":"ZM","cap":"卢萨卡","r":"非洲","a":752612,"p":21314956,"g":25303185342.2511,"mr":null,"mi":null},
  {"n":"哈萨克斯坦","e":"Kazakhstan","c":"KZ","cap":"阿斯塔纳","r":"亚洲","a":2724900,"p":20592571,"g":291480274648.826,"mr":null,"mi":null},
  {"n":"乍得","e":"Chad","c":"TD","cap":"恩贾梅纳","r":"非洲","a":1284000,"p":20299123,"g":19906706689.7582,"mr":null,"mi":null},
  {"n":"智利","e":"Chile","c":"CL","cap":"圣地亚哥","r":"南美洲","a":756102,"p":19764771,"g":329260633698.726,"mr":47,"mi":0.84},
  {"n":"罗马尼亚","e":"Romania","c":"RO","cap":"布加勒斯特","r":"欧洲","a":238391,"p":19051804,"g":382564217988.866,"mr":null,"mi":null},
  {"n":"索马里","e":"Somalia","c":"SO","cap":"摩加迪沙","r":"非洲","a":637657,"p":19009151,"g":11967000000,"mr":null,"mi":null},
  {"n":"塞内加尔","e":"Senegal","c":"SN","cap":"达喀尔","r":"非洲","a":196722,"p":18501984,"g":32169996051.8502,"mr":null,"mi":null},
  {"n":"危地马拉","e":"Guatemala","c":"GT","cap":"危地马拉城","r":"北美洲","a":108889,"p":18406359,"g":113215575150.885,"mr":null,"mi":null},
  {"n":"厄瓜多尔","e":"Ecuador","c":"EC","cap":"基多","r":"南美洲","a":276841,"p":18135478,"g":123802374000,"mr":null,"mi":null},
  {"n":"荷兰","e":"Netherlands","c":"NL","cap":"阿姆斯特丹","r":"欧洲","a":41850,"p":17993485,"g":1213936238063.28,"mr":36,"mi":0.64},
  {"n":"柬埔寨","e":"Cambodia","c":"KH","cap":"金边","r":"亚洲","a":181035,"p":17638801,"g":46352647037.2406,"mr":null,"mi":null},
  {"n":"津巴布韦","e":"Zimbabwe","c":"ZW","cap":"哈拉雷","r":"非洲","a":390757,"p":16634373,"g":41521975830.2351,"mr":null,"mi":null},
  {"n":"几内亚","e":"Guinea","c":"GN","cap":"科纳克里","r":"非洲","a":245857,"p":14754785,"g":25008678293.4073,"mr":null,"mi":null},
  {"n":"贝宁","e":"Benin","c":"BJ","cap":"波多诺伏","r":"非洲","a":112622,"p":14462724,"g":21482643706.4249,"mr":null,"mi":null},
  {"n":"卢旺达","e":"Rwanda","c":"RW","cap":"基加利","r":"非洲","a":26338,"p":14256567,"g":15111064181.9687,"mr":null,"mi":null},
  {"n":"布隆迪","e":"Burundi","c":"BI","cap":"布琼布拉","r":"非洲","a":27834,"p":14047786,"g":3037579858.38142,"mr":null,"mi":null},
  {"n":"玻利维亚","e":"Bolivia","c":"BO","cap":"苏克雷","r":"南美洲","a":1098581,"p":12413315,"g":54881327452.9667,"mr":null,"mi":null},
  {"n":"突尼斯","e":"Tunisia","c":"TN","cap":"突尼斯","r":"非洲","a":163610,"p":12277109,"g":51412122479.8468,"mr":null,"mi":null},
  {"n":"南苏丹","e":"South Sudan","c":"SS","cap":"朱巴","r":"非洲","a":619745,"p":11943408,"g":null,"mr":null,"mi":null},
  {"n":"比利时","e":"Belgium","c":"BE","cap":"布鲁塞尔","r":"欧洲","a":30528,"p":11858610,"g":670983130618.828,"mr":null,"mi":null},
  {"n":"海地","e":"Haiti","c":"HT","cap":"太子港","r":"北美洲","a":27750,"p":11772557,"g":24255657481.2502,"mr":null,"mi":null},
  {"n":"约旦","e":"Jordan","c":"JO","cap":"安曼","r":"亚洲","a":89342,"p":11552876,"g":58618380563.3803,"mr":null,"mi":null},
  {"n":"多米尼加","e":"Dominican Republic","c":"DO","cap":"圣多明各","r":"北美洲","a":48671,"p":11427557,"g":124282245638.568,"mr":null,"mi":null},
  {"n":"阿拉伯联合酋长国","e":"United Arab Emirates","c":"AE","cap":"阿布扎比","r":"亚洲","a":83600,"p":10986400,"g":552324919095.872,"mr":null,"mi":null},
  {"n":"古巴","e":"Cuba","c":"CU","cap":"哈瓦那","r":"北美洲","a":109884,"p":10979783,"g":null,"mr":null,"mi":null},
  {"n":"捷克","e":"Czechia","c":"CZ","cap":"布拉格","r":"欧洲","a":78865,"p":10905028,"g":347082562221.377,"mr":null,"mi":null},
  {"n":"洪都拉斯","e":"Honduras","c":"HN","cap":"特古西加尔巴","r":"北美洲","a":112492,"p":10825703,"g":36980171442.0603,"mr":null,"mi":null},
  {"n":"葡萄牙","e":"Portugal","c":"PT","cap":"里斯本","r":"欧洲","a":92090,"p":10694681,"g":313656884870.859,"mr":39,"mi":0.69},
  {"n":"塔吉克斯坦","e":"Tajikistan","c":"TJ","cap":"杜尚别","r":"亚洲","a":143100,"p":10590927,"g":14425113699.7925,"mr":null,"mi":null},
  {"n":"巴布亚新几内亚","e":"Papua New Guinea","c":"PG","cap":"莫尔兹比港","r":"大洋洲","a":462840,"p":10576502,"g":30803971189.4102,"mr":null,"mi":null},
  {"n":"瑞典","e":"Sweden","c":"SE","cap":"斯德哥尔摩","r":"欧洲","a":450295,"p":10569709,"g":604827393488.582,"mr":27,"mi":0.48},
  {"n":"希腊","e":"Greece","c":"GR","cap":"雅典","r":"欧洲","a":131990,"p":10405134,"g":256238371778.118,"mr":30,"mi":0.53},
  {"n":"阿塞拜疆","e":"Azerbaijan","c":"AZ","cap":"巴库","r":"亚洲","a":86600,"p":10202830,"g":74426000000,"mr":null,"mi":null},
  {"n":"以色列","e":"Israel","c":"IL","cap":"耶路撒冷","r":"亚洲","a":20770,"p":10002200,"g":542284494490.778,"mr":15,"mi":0.27},
  {"n":"匈牙利","e":"Hungary","c":"HU","cap":"布达佩斯","r":"欧洲","a":93028,"p":9562065,"g":222848211034.367,"mr":null,"mi":null},
  {"n":"奥地利","e":"Austria","c":"AT","cap":"维也纳","r":"欧洲","a":83871,"p":9177982,"g":534790720466.822,"mr":null,"mi":null},
  {"n":"白俄罗斯","e":"Belarus","c":"BY","cap":"明斯克","r":"欧洲","a":207600,"p":9132629,"g":78591839299.7087,"mr":null,"mi":null},
  {"n":"瑞士","e":"Switzerland","c":"CH","cap":"伯尔尼","r":"欧洲","a":41284,"p":9005582,"g":969919786394.884,"mr":44,"mi":0.79},
  {"n":"塞拉利昂","e":"Sierra Leone","c":"SL","cap":"弗里敦","r":"非洲","a":71740,"p":8642022,"g":6971127234.07241,"mr":null,"mi":null},
  {"n":"多哥","e":"Togo","c":"TG","cap":"洛美","r":"非洲","a":56785,"p":8406558,"g":10643440332.2445,"mr":null,"mi":null},
  {"n":"老挝","e":"Laos","c":"LA","cap":"万象","r":"亚洲","a":236800,"p":7769819,"g":16502933121.3379,"mr":null,"mi":null},
  {"n":"土库曼斯坦","e":"Turkmenistan","c":"TM","cap":"阿什哈巴德","r":"亚洲","a":488100,"p":7494498,"g":44249447717.2312,"mr":null,"mi":null},
  {"n":"利比亚","e":"Libya","c":"LY","cap":"的黎波里","r":"非洲","a":1759540,"p":7381023,"g":48487151215.345,"mr":null,"mi":null},
  {"n":"吉尔吉斯斯坦","e":"Kyrgyzstan","c":"KG","cap":"比什凯克","r":"亚洲","a":199951,"p":7221868,"g":18161630698.9052,"mr":null,"mi":null},
  {"n":"巴拉圭","e":"Paraguay","c":"PY","cap":"亚松森","r":"南美洲","a":406752,"p":6929153,"g":44738819362.3269,"mr":null,"mi":null},
  {"n":"尼加拉瓜","e":"Nicaragua","c":"NI","cap":"马那瓜","r":"北美洲","a":130373,"p":6916140,"g":19696311850.3289,"mr":null,"mi":null},
  {"n":"塞尔维亚","e":"Serbia","c":"RS","cap":"贝尔格莱德","r":"欧洲","a":88361,"p":6586476,"g":90088366320.4062,"mr":null,"mi":null},
  {"n":"保加利亚","e":"Bulgaria","c":"BG","cap":"索非亚","r":"欧洲","a":110879,"p":6441421,"g":113349149166.793,"mr":null,"mi":null},
  {"n":"萨尔瓦多","e":"El Salvador","c":"SV","cap":"圣萨尔瓦多","r":"北美洲","a":21041,"p":6338193,"g":34879730000,"mr":null,"mi":null},
  {"n":"刚果（布）","e":"Congo","c":"CG","cap":"布拉柴维尔","r":"非洲","a":342000,"p":6332961,"g":15719986076.6464,"mr":null,"mi":null},
  {"n":"新加坡","e":"Singapore","c":"SG","cap":"新加坡","r":"亚洲","a":710,"p":6036860,"g":572877260178.427,"mr":29,"mi":0.53},
  {"n":"丹麦","e":"Denmark","c":"DK","cap":"哥本哈根","r":"欧洲","a":43094,"p":5976992,"g":424524722037.047,"mr":45,"mi":0.81},
  {"n":"黎巴嫩","e":"Lebanon","c":"LB","cap":"贝鲁特","r":"亚洲","a":10452,"p":5805962,"g":25971643441.3408,"mr":null,"mi":null},
  {"n":"芬兰","e":"Finland","c":"FI","cap":"赫尔辛基","r":"欧洲","a":338424,"p":5619911,"g":298729432711.719,"mr":48,"mi":0.84},
  {"n":"利比里亚","e":"Liberia","c":"LR","cap":"蒙罗维亚","r":"非洲","a":111369,"p":5612817,"g":4779300900,"mr":null,"mi":null},
  {"n":"挪威","e":"Norway","c":"NO","cap":"奥斯陆","r":"欧洲","a":323802,"p":5572279,"g":500886328034.123,"mr":38,"mi":0.68},
  {"n":"斯洛伐克","e":"Slovakia","c":"SK","cap":"布拉迪斯拉发","r":"欧洲","a":49037,"p":5422069,"g":140934076532.375,"mr":null,"mi":null},
  {"n":"爱尔兰","e":"Ireland","c":"IE","cap":"都柏林","r":"欧洲","a":70273,"p":5395790,"g":609157459747.205,"mr":null,"mi":null},
  {"n":"中非共和国","e":"Central African Republic","c":"CF","cap":"班吉","r":"非洲","a":622984,"p":5330690,"g":2751494281.06887,"mr":null,"mi":null},
  {"n":"新西兰","e":"New Zealand","c":"NZ","cap":"惠灵顿","r":"大洋洲","a":270467,"p":5290000,"g":261497198363.906,"mr":null,"mi":null},
  {"n":"巴勒斯坦","e":"Palestine","c":"PS","cap":"拉姆安拉","r":"亚洲","a":6220,"p":5289152,"g":16016900000,"mr":null,"mi":null},
  {"n":"阿曼","e":"Oman","c":"OM","cap":"马斯喀特","r":"亚洲","a":309500,"p":5281538,"g":107137198699.61,"mr":null,"mi":null},
  {"n":"毛里塔尼亚","e":"Mauritania","c":"MR","cap":"努瓦克肖特","r":"非洲","a":1030700,"p":5169395,"g":10879212033.4823,"mr":null,"mi":null},
  {"n":"哥斯达黎加","e":"Costa Rica","c":"CR","cap":"圣何塞","r":"北美洲","a":51100,"p":5129910,"g":96715644330.6612,"mr":null,"mi":null},
  {"n":"科威特","e":"Kuwait","c":"KW","cap":"科威特城","r":"亚洲","a":17818,"p":4897263,"g":160903106639.233,"mr":null,"mi":null},
  {"n":"巴拿马","e":"Panama","c":"PA","cap":"巴拿马城","r":"北美洲","a":75417,"p":4515577,"g":86523959100,"mr":null,"mi":null},
  {"n":"克罗地亚","e":"Croatia","c":"HR","cap":"萨格勒布","r":"欧洲","a":56594,"p":3866200,"g":92981894167.9687,"mr":null,"mi":null},
  {"n":"格鲁吉亚","e":"Georgia","c":"GE","cap":"第比利斯","r":"亚洲","a":69700,"p":3812518,"g":34189423333.141,"mr":null,"mi":null},
  {"n":"厄立特里亚","e":"Eritrea","c":"ER","cap":"阿斯马拉","r":"非洲","a":117600,"p":3535603,"g":null,"mr":null,"mi":null},
  {"n":"蒙古","e":"Mongolia","c":"MN","cap":"乌兰巴托","r":"亚洲","a":1564110,"p":3524788,"g":23794540024.5132,"mr":null,"mi":null},
  {"n":"乌拉圭","e":"Uruguay","c":"UY","cap":"蒙得维的亚","r":"南美洲","a":181034,"p":3386588,"g":82322859144.2816,"mr":null,"mi":null},
  {"n":"波斯尼亚和黑塞哥维那","e":"Bosnia and Herzegovina","c":"BA","cap":"萨拉热窝","r":"欧洲","a":51209,"p":3164253,"g":29737363103.0492,"mr":null,"mi":null},
  {"n":"亚美尼亚","e":"Armenia","c":"AM","cap":"埃里温","r":"亚洲","a":29743,"p":3033500,"g":25955275380.0321,"mr":null,"mi":null},
  {"n":"纳米比亚","e":"Namibia","c":"NA","cap":"温得和克","r":"非洲","a":825615,"p":3030131,"g":13641190683.4641,"mr":null,"mi":null},
  {"n":"立陶宛","e":"Lithuania","c":"LT","cap":"维尔纽斯","r":"欧洲","a":65300,"p":2888278,"g":85503938573.5664,"mr":null,"mi":null},
  {"n":"卡塔尔","e":"Qatar","c":"QA","cap":"多哈","r":"亚洲","a":11586,"p":2857822,"g":216294505494.505,"mr":null,"mi":null},
  {"n":"牙买加","e":"Jamaica","c":"JM","cap":"金斯敦","r":"北美洲","a":10991,"p":2839175,"g":22014429050.9995,"mr":null,"mi":null},
  {"n":"冈比亚","e":"Gambia","c":"GM","cap":"班珠尔","r":"非洲","a":10689,"p":2759988,"g":2404888737.54853,"mr":null,"mi":null},
  {"n":"加蓬","e":"Gabon","c":"GA","cap":"利伯维尔","r":"非洲","a":267668,"p":2538952,"g":20895684425.6752,"mr":null,"mi":null},
  {"n":"博茨瓦纳","e":"Botswana","c":"BW","cap":"哈博罗内","r":"非洲","a":582000,"p":2521139,"g":19286251067.5078,"mr":null,"mi":null},
  {"n":"摩尔多瓦","e":"Moldova","c":"MD","cap":"基希讷乌","r":"欧洲","a":33846,"p":2402306,"g":18206842140.7615,"mr":null,"mi":null},
  {"n":"阿尔巴尼亚","e":"Albania","c":"AL","cap":"地拉那","r":"欧洲","a":28748,"p":2377128,"g":27037474263.2977,"mr":null,"mi":null},
  {"n":"莱索托","e":"Lesotho","c":"LS","cap":"马塞卢","r":"非洲","a":30355,"p":2337423,"g":2391282547.80028,"mr":null,"mi":null},
  {"n":"几内亚比绍","e":"Guinea-Bissau","c":"GW","cap":"比绍","r":"非洲","a":36125,"p":2201352,"g":2197777209.94218,"mr":null,"mi":null},
  {"n":"斯洛文尼亚","e":"Slovenia","c":"SI","cap":"卢布尔雅那","r":"欧洲","a":20273,"p":2127400,"g":72972015197.3859,"mr":null,"mi":null},
  {"n":"赤道几内亚","e":"Equatorial Guinea","c":"GQ","cap":"马拉博","r":"非洲","a":28051,"p":1892516,"g":13254388261.1258,"mr":null,"mi":null},
  {"n":"拉脱维亚","e":"Latvia","c":"LV","cap":"里加","r":"欧洲","a":64559,"p":1866124,"g":44001275012.6141,"mr":null,"mi":null},
  {"n":"北马其顿","e":"North Macedonia","c":"MK","cap":"斯科普里","r":"欧洲","a":25713,"p":1824359,"g":16951682221.3962,"mr":null,"mi":null},
  {"n":"巴林","e":"Bahrain","c":"BH","cap":"麦纳麦","r":"亚洲","a":765,"p":1588670,"g":47210732712.766,"mr":null,"mi":null},
  {"n":"东帝汶","e":"Timor-Leste","c":"TL","cap":"帝力","r":"亚洲","a":14874,"p":1400638,"g":1865608515.41321,"mr":null,"mi":null},
  {"n":"爱沙尼亚","e":"Estonia","c":"EE","cap":"塔林","r":"欧洲","a":45227,"p":1372341,"g":43130419829.35,"mr":null,"mi":null},
  {"n":"特立尼达和多巴哥","e":"Trinidad and Tobago","c":"TT","cap":"西班牙港","r":"北美洲","a":5130,"p":1368333,"g":25633544529.4849,"mr":null,"mi":null},
  {"n":"塞浦路斯","e":"Cyprus","c":"CY","cap":"尼科西亚","r":"欧洲","a":9251,"p":1358282,"g":37634551820.7367,"mr":null,"mi":null},
  {"n":"毛里求斯","e":"Mauritius","c":"MU","cap":"路易港","r":"非洲","a":2040,"p":1245779,"g":14938055690.3609,"mr":null,"mi":null},
  {"n":"斯威士兰","e":"Eswatini","c":"SZ","cap":"姆巴巴内","r":"非洲","a":17364,"p":1242822,"g":4858885840.77236,"mr":null,"mi":null},
  {"n":"吉布提","e":"Djibouti","c":"DJ","cap":"吉布提","r":"非洲","a":23200,"p":1168722,"g":4152145939.98458,"mr":null,"mi":null},
  {"n":"斐济","e":"Fiji","c":"FJ","cap":"苏瓦","r":"大洋洲","a":18272,"p":928784,"g":5968125909.27126,"mr":null,"mi":null},
  {"n":"科摩罗","e":"Comoros","c":"KM","cap":"莫罗尼","r":"非洲","a":1862,"p":866628,"g":1610082688.26617,"mr":null,"mi":null},
  {"n":"圭亚那","e":"Guyana","c":"GY","cap":"乔治敦","r":"南美洲","a":214969,"p":831087,"g":24662714628.2974,"mr":null,"mi":null},
  {"n":"所罗门群岛","e":"Solomon Islands","c":"SB","cap":"霍尼亚拉","r":"大洋洲","a":28896,"p":819198,"g":1583964703.75061,"mr":null,"mi":null},
  {"n":"不丹","e":"Bhutan","c":"BT","cap":"廷布","r":"亚洲","a":38394,"p":791524,"g":3346603858.7495,"mr":null,"mi":null},
  {"n":"卢森堡","e":"Luxembourg","c":"LU","cap":"卢森堡","r":"欧洲","a":2586,"p":677012,"g":93279851863.4062,"mr":null,"mi":null},
  {"n":"苏里南","e":"Suriname","c":"SR","cap":"帕拉马里博","r":"南美洲","a":163820,"p":634431,"g":4416775112.72266,"mr":null,"mi":null},
  {"n":"黑山","e":"Montenegro","c":"ME","cap":"波德戈里察","r":"欧洲","a":13812,"p":623525,"g":8274290505.96367,"mr":null,"mi":null},
  {"n":"马耳他","e":"Malta","c":"MT","cap":"瓦莱塔","r":"欧洲","a":316,"p":568847,"g":25042712191.3281,"mr":null,"mi":null},
  {"n":"马尔代夫","e":"Maldives","c":"MV","cap":"马累","r":"亚洲","a":300,"p":527799,"g":7061608267.25451,"mr":null,"mi":null},
  {"n":"佛得角","e":"Cape Verde","c":"CV","cap":"普拉亚","r":"非洲","a":4033,"p":524877,"g":2713721857.39153,"mr":null,"mi":null},
  {"n":"文莱","e":"Brunei","c":"BN","cap":"斯里巴加湾市","r":"亚洲","a":5765,"p":462721,"g":15340808592.48,"mr":null,"mi":null},
  {"n":"伯利兹","e":"Belize","c":"BZ","cap":"贝尔莫潘","r":"北美洲","a":22966,"p":417072,"g":3203631800,"mr":null,"mi":null},
  {"n":"巴哈马","e":"Bahamas","c":"BS","cap":"拿骚","r":"北美洲","a":13943,"p":401283,"g":15832800000,"mr":null,"mi":null},
  {"n":"冰岛","e":"Iceland","c":"IS","cap":"雷克雅未克","r":"欧洲","a":103000,"p":386506,"g":33186621855.0053,"mr":null,"mi":null},
  {"n":"瓦努阿图","e":"Vanuatu","c":"VU","cap":"维拉港","r":"大洋洲","a":12189,"p":327777,"g":1297956614.77783,"mr":null,"mi":null},
  {"n":"巴巴多斯","e":"Barbados","c":"BB","cap":"布里奇敦","r":"北美洲","a":430,"p":282467,"g":7597571450,"mr":null,"mi":null},
  {"n":"圣多美和普林西比","e":"São Tomé and Príncipe","c":"ST","cap":"圣多美","r":"非洲","a":964,"p":235536,"g":824992558.045383,"mr":null,"mi":null},
  {"n":"萨摩亚","e":"Samoa","c":"WS","cap":"阿皮亚","r":"大洋洲","a":2842,"p":218019,"g":1175749785.65113,"mr":null,"mi":null},
  {"n":"圣卢西亚","e":"Saint Lucia","c":"LC","cap":"卡斯特里","r":"北美洲","a":616,"p":179744,"g":2605148148.14815,"mr":null,"mi":null},
  {"n":"基里巴斯","e":"Kiribati","c":"KI","cap":"塔拉瓦","r":"大洋洲","a":811,"p":134518,"g":343153235.077124,"mr":null,"mi":null},
  {"n":"塞舌尔","e":"Seychelles","c":"SC","cap":"维多利亚","r":"非洲","a":452,"p":121354,"g":2228608684.29911,"mr":null,"mi":null},
  {"n":"格林纳达","e":"Grenada","c":"GD","cap":"圣乔治","r":"北美洲","a":344,"p":117207,"g":1351270370.37037,"mr":null,"mi":null},
  {"n":"密克罗尼西亚","e":"Micronesia","c":"FM","cap":"帕利基尔","r":"大洋洲","a":702,"p":113160,"g":481121300,"mr":null,"mi":null},
  {"n":"汤加","e":"Tonga","c":"TO","cap":"努库阿洛法","r":"大洋洲","a":747,"p":104175,"g":647488243.847291,"mr":null,"mi":null},
  {"n":"圣文森特和格林纳丁斯","e":"Saint Vincent and the Grenadines","c":"VC","cap":"金斯敦","r":"北美洲","a":389,"p":100616,"g":1157207407.40741,"mr":null,"mi":null},
  {"n":"安提瓜和巴布达","e":"Antigua and Barbuda","c":"AG","cap":"圣约翰","r":"北美洲","a":442,"p":93772,"g":2162366666.66667,"mr":null,"mi":null},
  {"n":"安道尔","e":"Andorra","c":"AD","cap":"安道尔城","r":"欧洲","a":468,"p":81938,"g":4044249678.65625,"mr":null,"mi":null},
  {"n":"多米尼克","e":"Dominica","c":"DM","cap":"罗索","r":"北美洲","a":751,"p":66205,"g":688881481.481481,"mr":null,"mi":null},
  {"n":"圣基茨和尼维斯","e":"Saint Kitts and Nevis","c":"KN","cap":"巴斯特尔","r":"北美洲","a":261,"p":46843,"g":1122388888.88889,"mr":null,"mi":null},
  {"n":"列支敦士登","e":"Liechtenstein","c":"LI","cap":"瓦杜兹","r":"欧洲","a":160,"p":40450,"g":8905764270.4054,"mr":null,"mi":null},
  {"n":"摩纳哥","e":"Monaco","c":"MC","cap":"摩纳哥","r":"欧洲","a":2.02,"p":38631,"g":11125788838.2812,"mr":null,"mi":null},
  {"n":"马绍尔群岛","e":"Marshall Islands","c":"MH","cap":"马朱罗","r":"大洋洲","a":181,"p":37548,"g":285000000,"mr":null,"mi":null},
  {"n":"圣马力诺","e":"San Marino","c":"SM","cap":"圣马力诺","r":"欧洲","a":61,"p":33977,"g":null,"mr":null,"mi":null},
  {"n":"帕劳","e":"Palau","c":"PW","cap":"恩吉鲁穆德","r":"大洋洲","a":459,"p":17695,"g":321501812.5,"mr":null,"mi":null},
  {"n":"瑙鲁","e":"Nauru","c":"NR","cap":"亚伦","r":"大洋洲","a":21,"p":11947,"g":167833414.846177,"mr":null,"mi":null},
  {"n":"图瓦卢","e":"Tuvalu","c":"TV","cap":"富纳富提","r":"大洋洲","a":26,"p":9646,"g":56752265.8012166,"mr":null,"mi":null},
  {"n":"梵蒂冈","e":"Vatican City","c":"VA","cap":"梵蒂冈城","r":"欧洲","a":0.44,"p":800,"g":null,"mr":null,"mi":null}
];

(() => {
  const state = { query: '', region: '全部', sortKey: 'p', sortDir: 'desc' };
  const defaultDir = { n: 'asc', m: 'asc', a: 'desc', p: 'desc', g: 'desc' };

  const tbody = document.getElementById('country-rows');
  const countEl = document.getElementById('country-count');
  const sumEl = document.getElementById('population-sum');
  const search = document.getElementById('country-search');
  const chips = [...document.querySelectorAll('[data-region]')];
  const heads = [...document.querySelectorAll('[data-sort]')];

  const fmtInt = value => value.toLocaleString('en-US');
  const fmtPop = p => p >= 1e8 ? (p / 1e8).toFixed(2) + ' 亿'
    : p >= 1e4 ? fmtInt(Math.round(p / 1e4)) + ' 万'
    : fmtInt(p);
  const fmtGdp = g => g >= 1e12 ? (g / 1e12).toFixed(2) + ' 万亿'
    : g >= 1e10 ? fmtInt(Math.round(g / 1e8)) + ' 亿'
    : g >= 1e8 ? (g / 1e8).toFixed(1) + ' 亿'
    : Math.round(g / 1e6) + ' 百万';

  const gdpRank = new Map(
    COUNTRIES.filter(row => row.g != null).sort((x, y) => y.g - x.g).map((row, index) => [row.c, index + 1]));
  const sortValue = (row, key) => key === 'm' ? (row.mr ?? Infinity) : key === 'g' ? (row.g ?? -Infinity) : row[key];

  function visible() {
    const q = state.query.trim().toLowerCase();
    return COUNTRIES
      .filter(row => (state.region === '全部' || row.r === state.region)
        && (!q || [row.n, row.e, row.c, row.cap].some(t => t.toLowerCase().includes(q))))
      .sort((x, y) => {
        const vx = sortValue(x, state.sortKey), vy = sortValue(y, state.sortKey);
        const xNull = !isFinite(vx), yNull = !isFinite(vy);
        if (xNull || yNull) return xNull && yNull ? 0 : xNull ? 1 : -1;
        if (vx === vy) return 0;
        return (vx < vy ? -1 : 1) * (state.sortDir === 'asc' ? 1 : -1);
      });
  }

  function render() {
    const rows = visible();
    tbody.replaceChildren(...rows.map(row => {
      const tr = document.createElement('tr');
      tr.innerHTML =
        `<td class="flag-cell"><img src="https://flagcdn.com/w40/${row.c.toLowerCase()}.png" alt="" loading="lazy" decoding="async" width="29" height="20"></td>` +
        `<th scope="row"><span class="cn">${row.n}</span><span class="en">${row.e}</span></th>` +
        `<td class="code-cell">${row.c}</td>` +
        `<td>${row.cap}</td>` +
        `<td class="region-cell">${row.r}</td>` +
        `<td class="num">${fmtInt(row.a)}</td>` +
        `<td class="num" title="${fmtInt(row.p)}">${fmtPop(row.p)}</td>` +
        `<td class="num">${row.mr ? `#${row.mr} · ${row.mi.toFixed(2)}` : '—'}</td>` +
        `<td class="num">${row.g == null ? '—' : `#${gdpRank.get(row.c)} ${fmtGdp(row.g)}`}</td>`;
      return tr;
    }));
    countEl.textContent = `显示 ${rows.length} / ${COUNTRIES.length} 国`;
    sumEl.textContent = `合计人口 ${fmtPop(rows.reduce((sum, row) => sum + row.p, 0))}`;
    heads.forEach(head => {
      const active = head.dataset.sort === state.sortKey;
      head.classList.toggle('is-sorted', active);
      head.dataset.dir = active ? state.sortDir : '';
      head.setAttribute('aria-sort', active ? (state.sortDir === 'asc' ? 'ascending' : 'descending') : 'none');
    });
  }

  search.addEventListener('input', () => { state.query = search.value; render(); });
  chips.forEach(chip => chip.addEventListener('click', () => {
    state.region = chip.dataset.region;
    chips.forEach(c => c.classList.toggle('is-active', c === chip));
    render();
  }));
  heads.forEach(head => head.addEventListener('click', () => {
    if (state.sortKey === head.dataset.sort) {
      state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      state.sortKey = head.dataset.sort;
      state.sortDir = defaultDir[head.dataset.sort] ?? 'asc';
    }
    render();
  }));

  render();
})();
