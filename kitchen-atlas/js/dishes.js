/* Kitchen Atlas — dish database.
   Each dish: ing = [canonicalKey, "display text with quantity"].
   `staples` are assumed to be in every kitchen and never count against a match. */
window.DISHES = [
{
  id:"carbonara", name:"Spaghetti alla Carbonara", country:"Italy", flag:"🇮🇹", region:"Europe",
  wiki:"Carbonara", time:"25 min", diff:"Easy", serves:4, tags:["pasta","quick","classic"],
  blurb:"Silky egg-and-cheese pasta with crisp cured pork — no cream, ever.",
  history:"Carbonara is a young dish by Italian standards: the first printed recipes appear in Rome just after the Second World War, around 1950. The most repeated origin story links it to American soldiers' rations of bacon and powdered egg meeting Roman pasta, though food historians also point to older Lazio shepherd dishes and to the carbonari (charcoal burners) the name evokes. What is certain is that Romans consider it non-negotiable: guanciale, pecorino, egg, pepper — cream is a foreign invention.",
  ing:[["spaghetti","400 g spaghetti or rigatoni"],["bacon","150 g guanciale or pancetta/bacon, diced"],["egg","3 whole eggs + 1 yolk"],["parmesan","80 g pecorino romano (or parmesan), grated"]],
  staples:["black pepper","salt"],
  steps:["Boil the pasta in well-salted water until al dente. Keep a mug of the starchy cooking water.","Meanwhile fry the diced guanciale in a dry cold pan over medium heat until the fat renders and the edges crisp, 6–8 min.","Beat the eggs with the cheese and a heavy amount of coarse black pepper into a thick paste.","Drain the pasta and toss it in the pork pan off the heat for 30 seconds so it picks up the fat.","Off the heat, pour in the egg mixture and toss hard, adding splashes of pasta water until the sauce turns glossy and coats every strand. Never let it boil or it scrambles.","Serve at once with more pecorino and pepper."]
},
{
  id:"aglio-olio", name:"Spaghetti Aglio e Olio", country:"Italy", flag:"🇮🇹", region:"Europe",
  wiki:"Aglio e olio", time:"15 min", diff:"Easy", serves:2, tags:["pasta","quick","vegan","budget"],
  blurb:"Four ingredients, ten minutes — Naples' famous midnight pasta.",
  history:"Born in Naples as a dish of the poor, aglio e olio was for centuries what you cooked when there was nothing in the house but garlic, oil and dried chilli. Neapolitans call it the spaghettata di mezzanotte — the midnight spaghetti made for friends after a night out. It survives unchanged because there is nothing left to remove.",
  ing:[["spaghetti","250 g spaghetti"],["garlic","4 cloves garlic, thinly sliced"],["olive oil","6 tbsp extra virgin olive oil"],["chili flakes","1 tsp dried chilli flakes"],["parsley","small handful parsley, chopped"]],
  staples:["salt"],
  steps:["Cook the spaghetti in generously salted water until al dente; reserve a cup of the water.","While it cooks, warm the olive oil gently with the sliced garlic over low heat until the garlic is pale gold — never brown, or it turns bitter.","Add the chilli flakes and take off the heat for a moment.","Toss the drained pasta into the oil with a splash of pasta water and stir vigorously until it emulsifies into a light sauce.","Fold through the parsley and serve immediately."]
},
{
  id:"margherita", name:"Pizza Margherita", country:"Italy", flag:"🇮🇹", region:"Europe",
  wiki:"Pizza Margherita", time:"2 h (incl. rise)", diff:"Medium", serves:2, tags:["baking","classic"],
  blurb:"Tomato, mozzarella, basil — the red, white and green of the Italian flag.",
  history:"Flatbreads with toppings are ancient, but the Margherita has a story with a date: in 1889 Naples pizzaiolo Raffaele Esposito is said to have made three pizzas for Queen Margherita of Savoy, and she preferred the patriotic one topped in the colours of the newly unified Italy. The tale is likely embroidered, but Neapolitan pizza is now UNESCO-listed and the Margherita remains its benchmark.",
  ing:[["flour","300 g strong bread flour"],["yeast","3 g dried yeast"],["canned tomatoes","200 g tinned San Marzano tomatoes, crushed"],["mozzarella","150 g mozzarella, torn and drained"],["basil","fresh basil leaves"],["olive oil","olive oil to finish"]],
  staples:["salt","water"],
  steps:["Mix flour, yeast, 8 g salt and 190 ml water into a shaggy dough; knead 8 min until smooth. Rise 1–2 h until doubled.","Heat the oven as hot as it goes (250 °C+) with a tray or stone inside.","Stretch the dough by hand into a thin round, leaving a puffy rim. Never use a rolling pin.","Spread crushed tomato thinly, season with salt, scatter the mozzarella.","Bake on the hot surface 7–10 min until the crust blisters and chars in spots.","Finish with fresh basil and a thread of olive oil."]
},
{
  id:"risotto-milanese", name:"Risotto alla Milanese", country:"Italy", flag:"🇮🇹", region:"Europe",
  wiki:"Risotto alla milanese", time:"35 min", diff:"Medium", serves:4, tags:["rice","comfort"],
  blurb:"Saffron-gold risotto, the signature plate of Milan.",
  history:"Legend credits a 16th-century glassmaker's apprentice working on the windows of Milan's Duomo, who used saffron to tint glass and — as a wedding joke — tinted the rice too. The dish became Milan's emblem and traditionally accompanies ossobuco. Saffron's presence also traces the city's medieval trade links with the Arab world.",
  ing:[["rice","320 g arborio or carnaroli rice"],["onion","1 small onion, finely chopped"],["butter","80 g butter"],["white wine","100 ml dry white wine"],["stock","1.2 L hot chicken or vegetable stock"],["saffron","1 good pinch saffron threads"],["parmesan","70 g parmesan, grated"]],
  staples:["salt"],
  steps:["Soak the saffron in a ladle of hot stock.","Soften the onion in half the butter without colouring, 5 min. Add the rice and toast 2 min until the grains look glassy.","Pour in the wine and let it evaporate.","Add hot stock one ladle at a time, stirring, waiting until each is absorbed — about 18 min.","Stir in the saffron stock near the end; the rice should be creamy but still have bite.","Off the heat beat in the remaining cold butter and the parmesan, cover 2 min, then serve loose and wavy."]
},
{
  id:"ragu-bolognese", name:"Tagliatelle al Ragù (Bolognese)", country:"Italy", flag:"🇮🇹", region:"Europe",
  wiki:"Bolognese sauce", time:"3 h", diff:"Medium", serves:6, tags:["pasta","slow","comfort"],
  blurb:"The long-simmered meat sauce of Bologna — served on tagliatelle, not spaghetti.",
  history:"The first written ragù alla bolognese is Pellegrino Artusi's, published in 1891. In 1982 the Accademia Italiana della Cucina deposited an official recipe with the Bologna chamber of commerce: beef, pancetta, soffritto, a little tomato, milk and wine — and always fresh egg tagliatelle. 'Spaghetti bolognese' is an emigrant dish, beloved abroad and unknown in Bologna.",
  ing:[["ground beef","500 g beef mince (or half beef, half pork)"],["bacon","80 g pancetta, finely diced"],["onion","1 onion"],["carrot","1 carrot"],["celery","1 celery stick"],["canned tomatoes","400 g tinned tomatoes or passata"],["red wine","150 ml red wine"],["milk","150 ml whole milk"],["pasta","fresh tagliatelle to serve"]],
  staples:["olive oil","salt","black pepper"],
  steps:["Chop onion, carrot and celery very finely and sweat slowly in oil with the pancetta, 10 min.","Raise the heat, add the mince and brown it properly, breaking up the lumps.","Pour in the wine and cook it away.","Add the tomatoes, season, and simmer uncovered on the lowest heat for at least 2 hours, adding water when it tightens.","Stir in the milk in the final 30 minutes — it softens the meat and rounds the acidity.","Toss with cooked tagliatelle and plenty of parmesan."]
},
{
  id:"shakshuka", name:"Shakshuka", country:"Tunisia / Levant", flag:"🇹🇳", region:"Middle East & North Africa",
  wiki:"Shakshouka", time:"30 min", diff:"Easy", serves:2, tags:["eggs","breakfast","vegetarian","one-pan"],
  blurb:"Eggs poached in a spiced tomato and pepper stew, eaten straight from the pan with bread.",
  history:"Shakshuka — from an Arabic-Berber root meaning 'a mixture' — is North African, most often traced to Tunisia and Libya, where tomatoes and peppers arrived from the New World via Ottoman trade. Tunisian Jewish migrants carried it to Israel in the mid-20th century, where it became a national breakfast, and from there it spread to brunch menus worldwide.",
  ing:[["canned tomatoes","400 g tinned tomatoes"],["bell pepper","1 red pepper, sliced"],["onion","1 onion, sliced"],["garlic","3 cloves garlic"],["egg","4 eggs"],["cumin","1 tsp ground cumin"],["paprika","1 tsp sweet paprika"],["parsley","parsley or coriander to finish"]],
  staples:["olive oil","salt","black pepper","chili flakes"],
  steps:["Fry the onion and pepper in olive oil until soft and slightly caramelised, 10 min.","Add garlic, cumin and paprika and cook 1 min until fragrant.","Pour in the tomatoes, season, and simmer until thick enough to hold a trough, 10–12 min.","Make wells in the sauce and crack an egg into each. Cover and cook on low until the whites set but the yolks stay runny, 6–8 min.","Scatter with herbs and serve with warm flatbread for scooping."]
},
{
  id:"hummus", name:"Hummus bi Tahini", country:"Lebanon / Levant", flag:"🇱🇧", region:"Middle East & North Africa",
  wiki:"Hummus", time:"20 min", diff:"Easy", serves:4, tags:["dip","vegan","budget"],
  blurb:"Chickpeas whipped with tahini and lemon until impossibly smooth.",
  history:"Chickpeas have been cultivated in the Levant for some 10,000 years, and a 13th-century Cairo cookbook records a cold chickpea purée with vinegar and herbs. Modern hummus — chickpea, tahini, lemon, garlic — belongs to the shared kitchen of Lebanon, Syria, Palestine, Jordan and Israel, and few dishes are argued over with more affection.",
  ing:[["chickpeas","400 g cooked chickpeas (1 tin)"],["tahini","4 tbsp tahini"],["lemon","juice of 1½ lemons"],["garlic","1 small clove garlic"],["olive oil","olive oil to serve"],["cumin","½ tsp cumin (optional)"]],
  staples:["salt","water","ice"],
  steps:["If using tinned chickpeas, simmer them 10 min with a pinch of bicarbonate of soda and slip off any loose skins — this is the secret to smoothness.","Blend the lemon juice and garlic first, then leave to sit 2 min and strain if you want it mellow.","Add tahini and blitz until it seizes pale, then loosen with 2–3 tbsp iced water until creamy.","Add the warm chickpeas and salt and blend a full 3–4 minutes, longer than feels necessary.","Spread in a bowl, make a swirl, pour olive oil into it, dust with cumin or paprika."]
},
{
  id:"tabbouleh", name:"Tabbouleh", country:"Lebanon", flag:"🇱🇧", region:"Middle East & North Africa",
  wiki:"Tabbouleh", time:"20 min", diff:"Easy", serves:4, tags:["salad","vegan","fresh"],
  blurb:"A parsley salad with a little bulgur — not a bulgur salad with a little parsley.",
  history:"Tabbouleh comes from the mountains of Lebanon and Syria, where herbs grow thick, and it is a cornerstone of the mezze table. The Levantine original is overwhelmingly green; the grain-heavy versions common abroad reverse the proportions. In Lebanon it is scooped with romaine or cabbage leaves rather than a fork.",
  ing:[["parsley","3 large bunches flat-leaf parsley, very finely chopped"],["bulgur","3 tbsp fine bulgur"],["tomato","3 firm tomatoes, finely diced"],["mint","small bunch mint, chopped"],["spring onion","4 spring onions, sliced"],["lemon","juice of 1–2 lemons"],["olive oil","4 tbsp olive oil"]],
  staples:["salt","black pepper"],
  steps:["Soak the bulgur in the lemon juice and the tomato juices for 15 min — no boiling water.","Wash and dry the parsley thoroughly, then chop with a sharp knife (a food processor bruises it).","Combine parsley, mint, tomato, spring onion and the soaked bulgur.","Dress with olive oil, extra lemon, salt and pepper just before serving so it stays crisp."]
},
{
  id:"falafel", name:"Falafel", country:"Egypt / Levant", flag:"🇪🇬", region:"Middle East & North Africa",
  wiki:"Falafel", time:"30 min + soak", diff:"Medium", serves:4, tags:["vegan","street food","fried"],
  blurb:"Crisp herb-green fritters of soaked raw chickpeas.",
  history:"Falafel is widely believed to have begun in Egypt as ta'amiya, made with fava beans, possibly among Coptic Christians as a Lenten food, before travelling north into the Levant where chickpeas took over. Today it is street food from Alexandria to Amman, and one of the world's great vegan foods by accident rather than design.",
  ing:[["chickpeas","250 g dried chickpeas, soaked 12 h (never tinned)"],["onion","1 onion, quartered"],["garlic","4 cloves garlic"],["parsley","large bunch parsley"],["cilantro","large bunch coriander"],["cumin","2 tsp cumin"],["coriander seed","1 tsp ground coriander"],["flour","1 tbsp flour or chickpea flour"]],
  staples:["salt","black pepper","oil for frying","baking powder"],
  steps:["Drain the soaked chickpeas well and pat dry. Do not cook them.","Pulse chickpeas, onion, garlic, herbs and spices to a coarse, damp crumb — not a purée.","Rest the mix in the fridge 30 min, then stir in the flour and ½ tsp baking powder.","Shape into small balls or patties, pressing firmly.","Deep-fry at 175 °C for 3–4 min until deep brown and hollow-sounding.","Serve in pita with tahini sauce, tomato, pickles and salad."]
},
{
  id:"mujadara", name:"Mujadara", country:"Levant", flag:"🇸🇾", region:"Middle East & North Africa",
  wiki:"Mujaddara", time:"50 min", diff:"Easy", serves:4, tags:["vegan","budget","rice","one-pot"],
  blurb:"Lentils and rice under a heap of dark, sweet fried onions.",
  history:"A recipe for mujadara appears in the Kitab al-Tabikh, compiled in Baghdad in 1226, where it was considered a dish for the poor — though rich enough that a proverb calls a hungry man's love for it proverbial. It remains a Friday and fasting-day staple across Syria, Lebanon, Palestine and Jordan, eaten warm or at room temperature with yoghurt.",
  ing:[["lentils","200 g brown or green lentils"],["rice","150 g long-grain rice"],["onion","3 large onions, thinly sliced"],["cumin","1 tsp cumin"],["olive oil","4 tbsp olive oil"],["yogurt","yoghurt to serve"]],
  staples:["salt","black pepper","water"],
  steps:["Fry the onions slowly in oil, 25–30 min, until genuinely dark brown and sweet. Lift out half for the top.","Simmer the lentils in water until nearly tender, about 15 min.","Add the rice, cumin, the remaining onions, salt and enough hot water to cover by 1.5 cm.","Cover and cook on the lowest heat 15 min, then rest off the heat 10 min.","Fluff, pile the reserved crisp onions on top, and serve with yoghurt and a cucumber salad."]
},
{
  id:"fattoush", name:"Fattoush", country:"Lebanon", flag:"🇱🇧", region:"Middle East & North Africa",
  wiki:"Fattoush", time:"15 min", diff:"Easy", serves:4, tags:["salad","vegan","quick","no-waste"],
  blurb:"Chopped salad with crisped stale bread and sour sumac.",
  history:"Fattoush belongs to the Levantine family of fattat — dishes built on stale flatbread — invented by peasant households unwilling to waste a crumb. Sumac, the tart red berry that defines the dressing, has been used as a souring agent in the region since long before lemons arrived.",
  ing:[["pita","2 stale pita breads"],["cucumber","2 cucumbers, chopped"],["tomato","3 tomatoes, chopped"],["radish","6 radishes, sliced"],["lettuce","1 romaine heart, shredded"],["spring onion","3 spring onions"],["mint","handful mint"],["parsley","handful parsley"],["sumac","2 tsp sumac"],["lemon","juice of 1 lemon"],["olive oil","5 tbsp olive oil"]],
  staples:["salt","black pepper"],
  steps:["Tear the pita and toast or shallow-fry until crisp and golden.","Chop all the vegetables to roughly the same bite-size pieces.","Whisk lemon, olive oil, sumac, salt and pepper (a little pomegranate molasses if you have it).","Toss everything together and add the bread at the very last moment so it keeps its crunch."]
},
{
  id:"shawarma", name:"Chicken Shawarma", country:"Levant", flag:"🇯🇴", region:"Middle East & North Africa",
  wiki:"Shawarma", time:"30 min + marinate", diff:"Easy", serves:4, tags:["chicken","street food"],
  blurb:"Spice-marinated chicken, roasted hard and shaved into flatbread with garlic sauce.",
  history:"Shawarma descends from the Ottoman döner kebab — meat stacked on a vertical spit — which spread through the Levant in the 19th century and gave the world the gyro in Greece and al pastor in Mexico, the latter carried by Lebanese migrants. The name comes from the Turkish çevirme, 'turning'.",
  ing:[["chicken thighs","800 g boneless chicken thighs"],["yogurt","3 tbsp yoghurt"],["garlic","4 cloves garlic"],["lemon","juice of 1 lemon"],["cumin","2 tsp cumin"],["paprika","2 tsp paprika"],["cinnamon","½ tsp cinnamon"],["turmeric","½ tsp turmeric"],["pita","flatbreads to serve"]],
  staples:["olive oil","salt","black pepper"],
  steps:["Mix yoghurt, crushed garlic, lemon, oil and all the spices; coat the chicken and marinate at least 2 h, ideally overnight.","Spread on a tray and roast at 220 °C for 20–25 min until the edges char, or sear in a very hot pan.","Rest 5 min, then slice thinly across the grain.","Warm the flatbreads, spread with garlic sauce or tahini, and fill with chicken, pickles, tomato and onion tossed in sumac."]
},
{
  id:"koshari", name:"Koshari", country:"Egypt", flag:"🇪🇬", region:"Middle East & North Africa",
  wiki:"Kushari", time:"1 h", diff:"Medium", serves:4, tags:["vegan","street food","budget","carbs"],
  blurb:"Egypt's national street dish: rice, lentils and pasta under spiced tomato sauce and fried onions.",
  history:"Koshari appeared in Cairo in the 19th century and is a portrait of Egypt's trade history on one plate: rice from Asia, lentils native to the region, pasta brought by Italians, tomatoes from the Americas. Its likely ancestor is the Indian khichri, carried over by British Indian troops. It is sold from tiled shops with brass pots and eaten by everyone.",
  ing:[["rice","200 g rice"],["lentils","150 g brown lentils"],["pasta","100 g small macaroni"],["chickpeas","1 tin chickpeas, drained"],["onion","3 onions, sliced"],["canned tomatoes","500 g passata"],["garlic","4 cloves garlic"],["vinegar","2 tbsp vinegar"],["cumin","2 tsp cumin"]],
  staples:["oil","salt","chili flakes"],
  steps:["Fry the onions until deep brown and crisp; drain on paper.","Boil the lentils until tender; cook the rice; boil the pasta. Keep all three warm.","For the sauce, fry garlic in a little onion oil, add cumin, chilli, passata and vinegar and simmer 15 min until thick and sharp.","Layer in a bowl: rice and lentils, then pasta, then chickpeas.","Ladle over the hot tomato sauce and crown with the fried onions. Serve with extra vinegar-garlic sauce (daqqa)."]
},
{
  id:"tagine-chicken", name:"Chicken Tagine with Olives & Lemon", country:"Morocco", flag:"🇲🇦", region:"Middle East & North Africa",
  wiki:"Tajine", time:"1 h 15", diff:"Medium", serves:4, tags:["chicken","slow","one-pot"],
  blurb:"Slow-braised chicken perfumed with saffron, ginger and preserved lemon.",
  history:"The tagine is both the conical clay pot and what cooks in it — a Berber technique that traps steam and returns it to the food, perfect for a land where fuel and water are precious. Preserved lemons and olives mark the Fassi (Fez) style, and the spice mixture reflects centuries of Saharan caravan trade in ginger, saffron and pepper.",
  ing:[["chicken thighs","8 chicken thighs or 1 jointed chicken"],["onion","2 onions, sliced"],["garlic","4 cloves garlic"],["ginger","1 tsp ground ginger"],["turmeric","1 tsp turmeric"],["saffron","pinch saffron"],["olives","150 g green olives"],["preserved lemon","1 preserved lemon, sliced (or zest of 1 lemon)"],["cilantro","bunch coriander"],["parsley","bunch parsley"]],
  staples:["olive oil","salt","black pepper","water"],
  steps:["Rub the chicken with garlic, ginger, turmeric, saffron, salt and pepper; leave 30 min if you can.","Brown the pieces in oil in the tagine or a heavy pot, then lift out.","Soften the onions in the same fat until collapsing, 10 min.","Return the chicken, add half the herbs tied in a bundle and 200 ml water. Cover and cook very gently 45 min.","Add the olives and preserved lemon for the last 10 min so they keep their bite.","Reduce the sauce if loose, scatter with chopped herbs, and serve with bread or couscous."]
},
{
  id:"couscous-veg", name:"Seven-Vegetable Couscous", country:"Morocco", flag:"🇲🇦", region:"Middle East & North Africa",
  wiki:"Couscous", time:"1 h", diff:"Medium", serves:6, tags:["vegan","one-pot","friday"],
  blurb:"Steamed semolina under a mound of saffron-broth vegetables.",
  history:"Couscous is Berber and very old — steamer pots dating to the 9th century have been found in North Africa — and in 2020 UNESCO listed it as shared heritage of Algeria, Morocco, Mauritania and Tunisia. In Morocco it is the Friday dish, cooked after prayers, and the number seven in the vegetable count is considered lucky.",
  ing:[["couscous","500 g couscous"],["carrot","3 carrots"],["zucchini","2 courgettes"],["pumpkin","300 g pumpkin"],["turnip","2 turnips"],["chickpeas","1 tin chickpeas"],["onion","2 onions"],["canned tomatoes","2 tomatoes, chopped"],["turmeric","1 tsp turmeric"],["ginger","1 tsp ground ginger"],["cilantro","bunch coriander"]],
  staples:["olive oil","salt","black pepper","water","butter"],
  steps:["Start a broth: onions, tomato, spices, chickpeas and 1.5 L water, simmered 20 min.","Add the hard vegetables (carrot, turnip) and cook 15 min, then the pumpkin and courgette for 10 more.","Meanwhile moisten the couscous with salted water and oil, rake it with your fingers, and steam it uncovered over the broth three times, resting and fluffing between each.","Mound the couscous on a wide platter, hollow the centre, and arrange the vegetables in it.","Moisten with ladles of broth and serve the rest alongside with harissa."]
},
{
  id:"paella-valenciana", name:"Paella", country:"Spain", flag:"🇪🇸", region:"Europe",
  wiki:"Paella", time:"1 h", diff:"Medium", serves:4, tags:["rice","one-pan","seafood"],
  blurb:"Saffron rice cooked flat and wide until a toasted crust forms underneath.",
  history:"Paella comes from the rice fields around Albufera lagoon in Valencia, where farm workers cooked over orange wood in a wide flat pan — the paella, from the Latin patella, 'pan'. The original is rabbit, chicken and beans; seafood paella is a coastal cousin. The prize is the socarrat, the caramelised layer at the bottom, and Valencians will tell you it is never stirred.",
  ing:[["rice","350 g bomba or short-grain rice"],["chicken thighs","400 g chicken, in pieces"],["green beans","150 g flat green beans"],["bell pepper","1 red pepper, sliced"],["tomato","2 tomatoes, grated"],["garlic","3 cloves garlic"],["paprika","1 tsp smoked paprika"],["saffron","good pinch saffron"],["stock","1 L hot chicken stock"],["lemon","lemon wedges"]],
  staples:["olive oil","salt"],
  steps:["Brown the chicken in oil in a wide shallow pan and push to the edges.","Fry the beans and pepper, then add garlic, grated tomato and paprika and cook down to a dark sofrito.","Stir in the rice for 1 min, then pour in the hot saffron stock and season. Spread everything flat.","Cook on high 10 min, then low 8–10 min. Do not stir from this point.","Listen for a faint crackle, then give it 60–90 seconds more to build the socarrat.","Rest under a cloth 5 min and serve with lemon."]
},
{
  id:"tortilla-espanola", name:"Tortilla Española", country:"Spain", flag:"🇪🇸", region:"Europe",
  wiki:"Spanish omelette", time:"40 min", diff:"Medium", serves:4, tags:["eggs","vegetarian","tapas","budget"],
  blurb:"A thick potato-and-egg cake — Spain's most argued-over dish (onion or no onion).",
  history:"The first known reference is a 1817 petition from Navarre describing a cheap egg-and-potato dish that could feed a poor household. It spread with the potato through 19th-century Spain and became the default tapa, packed for picnics and eaten at any hour. The national argument — con cebolla or sin cebolla — has never been settled.",
  ing:[["potato","700 g waxy potatoes, thinly sliced"],["egg","6 eggs"],["onion","1 large onion, sliced (optional but recommended)"],["olive oil","300 ml olive oil for confiting"]],
  staples:["salt"],
  steps:["Cook the potato and onion gently in the oil over low heat until soft but not coloured, 20 min. They should poach, not fry.","Drain well (keep the oil — it is delicious).","Beat the eggs with salt, fold in the hot potatoes, and let the mixture sit 10 min.","Pour into a hot non-stick pan with a slick of oil and cook 4 min on medium-low.","Slide onto a plate, invert the pan over it, flip, and cook 3 min more. The centre should stay just soft (jugosa).","Rest, then serve at room temperature in wedges."]
},
{
  id:"gazpacho", name:"Gazpacho Andaluz", country:"Spain", flag:"🇪🇸", region:"Europe",
  wiki:"Gazpacho", time:"15 min + chill", diff:"Easy", serves:4, tags:["soup","vegan","cold","summer","no-cook"],
  blurb:"Chilled raw tomato soup — Andalusian air-conditioning.",
  history:"Gazpacho predates the tomato: the original Andalusian version was a pounded paste of stale bread, garlic, oil and vinegar, likely descended from Roman and Moorish practice. Tomatoes and peppers only joined after the Columbian exchange, giving the red soup we know by the 19th century. Field workers drank it from a jug in the heat.",
  ing:[["tomato","1 kg ripe tomatoes"],["cucumber","1 cucumber"],["bell pepper","1 green pepper"],["garlic","1 clove garlic"],["bread","50 g stale bread"],["olive oil","80 ml extra virgin olive oil"],["vinegar","2 tbsp sherry vinegar"]],
  staples:["salt","water"],
  steps:["Soak the bread briefly in water and squeeze out.","Blend tomatoes, cucumber, pepper, garlic and bread until completely smooth — a full 2 minutes.","With the motor running, pour in the olive oil to emulsify; the colour lightens to coral.","Season with vinegar and salt, then pass through a sieve for a silky texture.","Chill at least 3 hours and serve very cold with diced vegetables on top."]
},
{
  id:"ratatouille", name:"Ratatouille", country:"France", flag:"🇫🇷", region:"Europe",
  wiki:"Ratatouille", time:"1 h", diff:"Easy", serves:4, tags:["vegan","vegetables","summer"],
  blurb:"Provençal summer vegetables stewed separately, then married.",
  history:"Ratatouille niçoise is a peasant dish from around Nice, its name from touiller, to stir up. It could only exist after tomatoes, peppers and aubergines — all New World or Asian imports — settled into Provençal gardens in the 18th and 19th centuries. Purists insist each vegetable is cooked apart so none turns to mush.",
  ing:[["eggplant","1 large aubergine"],["zucchini","2 courgettes"],["bell pepper","2 peppers"],["tomato","4 ripe tomatoes"],["onion","1 onion"],["garlic","3 cloves garlic"],["thyme","thyme and a bay leaf"],["basil","basil to finish"],["olive oil","olive oil, generously"]],
  staples:["salt","black pepper"],
  steps:["Cut everything into similar chunks. Salt the aubergine 20 min and pat dry.","Fry each vegetable separately in olive oil until browned at the edges, setting each aside.","Soften the onion and garlic last, add the tomatoes and herbs and cook to a sauce.","Return all the vegetables, season, and stew gently 20 min uncovered.","Rest at least an hour — it is better warm than hot, and better still the next day. Finish with torn basil."]
},
{
  id:"french-onion-soup", name:"Soupe à l'Oignon Gratinée", country:"France", flag:"🇫🇷", region:"Europe",
  wiki:"French onion soup", time:"1 h 30", diff:"Medium", serves:4, tags:["soup","comfort","winter"],
  blurb:"Onions cooked to mahogany, beef broth, and a raft of melted cheese.",
  history:"Onion soups are Roman-old and were long the food of the poor, but the gratinéed version is Parisian, associated with the all-night workers and revellers of Les Halles market, where it was eaten at dawn. Legend absurdly credits Louis XV improvising it in a hunting lodge; the market porters have the better claim.",
  ing:[["onion","1 kg onions, sliced thin"],["butter","50 g butter"],["stock","1.2 L good beef stock"],["white wine","150 ml dry white wine"],["bread","4 thick slices baguette"],["cheese","150 g gruyère, grated"],["thyme","2 sprigs thyme"]],
  staples:["salt","black pepper","flour"],
  steps:["Cook the onions in butter over medium-low heat, stirring often, for 45–60 minutes. There is no shortcut: they must go deep brown and jammy.","Dust with a spoon of flour, cook 2 min, then deglaze with the wine.","Add stock and thyme and simmer 20 min. Season carefully.","Toast the bread, float it on the soup in ovenproof bowls, and bury it in gruyère.","Grill until blistered and bubbling over the rim."]
},
{
  id:"quiche-lorraine", name:"Quiche Lorraine", country:"France", flag:"🇫🇷", region:"Europe",
  wiki:"Quiche", time:"1 h 15", diff:"Medium", serves:6, tags:["baking","eggs","picnic"],
  blurb:"Custard tart with smoky bacon — from the German-speaking east of France.",
  history:"Quiche comes from Lorraine, a borderland that has changed hands between France and Germany repeatedly; the word derives from the German Kuchen, cake. The medieval original used bread dough and had no cheese at all — a point Lorrainers still make. Cream, egg and lardons remain the whole idea.",
  ing:[["flour","200 g plain flour"],["butter","100 g cold butter"],["bacon","200 g smoked bacon lardons"],["egg","3 eggs"],["cream","300 ml double cream"],["nutmeg","grating of nutmeg"],["cheese","80 g gruyère (optional, not traditional)"]],
  staples:["salt","black pepper","water"],
  steps:["Rub butter into flour with salt, bind with 2–3 tbsp cold water, chill 30 min.","Line a tart tin, prick, and blind-bake at 190 °C for 15 min with weights, then 5 min without.","Fry the lardons until the fat runs and they colour; drain.","Beat eggs, cream, pepper and nutmeg. Scatter the bacon in the case and pour the custard over.","Bake 30–35 min at 170 °C until barely set with a faint wobble. Cool 15 min before cutting."]
},
{
  id:"crepes", name:"Crêpes", country:"France", flag:"🇫🇷", region:"Europe",
  wiki:"Crêpe", time:"30 min", diff:"Easy", serves:4, tags:["sweet","breakfast","budget","kids"],
  blurb:"Paper-thin pancakes from Brittany, sweet or savoury.",
  history:"Crêpes are Breton, born of buckwheat brought back from the Crusades and grown on poor Breton soil — the dark galette is the savoury original, the white-flour crêpe its sweeter descendant. They are eaten across France on Candlemas (2 February), when tradition says you should flip one while holding a coin for luck.",
  ing:[["flour","250 g plain flour"],["egg","4 eggs"],["milk","600 ml milk"],["butter","50 g melted butter"],["sugar","1 tbsp sugar (for sweet)"]],
  staples:["salt"],
  steps:["Whisk flour, eggs and a pinch of salt, then loosen gradually with the milk to a thin cream. Stir in the melted butter.","Rest the batter 30 min — this relaxes the gluten and makes the crêpes tender.","Heat a wide pan, wipe with butter, and pour a small ladle in, swirling to coat.","Cook 45 s until the edges lift and lace, flip and give it 20 s.","Fill with lemon and sugar, jam, or ham and cheese."]
},
{
  id:"greek-salad", name:"Horiatiki (Greek Salad)", country:"Greece", flag:"🇬🇷", region:"Europe",
  wiki:"Greek salad", time:"10 min", diff:"Easy", serves:4, tags:["salad","vegetarian","no-cook","quick"],
  blurb:"Village salad: no lettuce, big chunks, a slab of feta on top.",
  history:"Horiatiki means 'village-style'. The story most often told is that Greek tavernas in the 1960s, hemmed in by price controls on salads, added a slab of feta — which was not a salad ingredient by the rules — to justify a higher price. Whatever the truth, it fixed the modern form: tomato, cucumber, onion, olives, oregano, oil, feta.",
  ing:[["tomato","4 ripe tomatoes, in wedges"],["cucumber","1 cucumber, thick half-moons"],["onion","½ red onion, sliced"],["bell pepper","1 green pepper, sliced"],["olives","handful kalamata olives"],["feta","200 g feta, in one slab"],["oregano","dried oregano"],["olive oil","4 tbsp Greek olive oil"]],
  staples:["salt"],
  steps:["Cut the vegetables in generous chunks — this is not a finely chopped salad.","Combine with the olives and salt lightly.","Lay the whole slab of feta on top; do not crumble it.","Dust the feta with oregano and pour olive oil over everything. Serve with bread to mop the juices."]
},
{
  id:"moussaka", name:"Moussaka", country:"Greece", flag:"🇬🇷", region:"Europe",
  wiki:"Moussaka", time:"2 h", diff:"Hard", serves:6, tags:["baked","comfort","slow"],
  blurb:"Layers of aubergine and spiced lamb under a thick béchamel.",
  history:"Layered aubergine-and-meat dishes are found from the Balkans to the Levant — the name is Arabic, musaqqa'a, 'chilled'. The Greek version with a French béchamel top is modern and deliberate: chef Nikolaos Tselementes created it in the 1920s as part of a campaign to 'de-Orientalise' Greek cooking. The cinnamon in the meat sauce is the older layer showing through.",
  ing:[["eggplant","3 aubergines, sliced"],["ground beef","700 g lamb or beef mince"],["onion","2 onions"],["garlic","3 cloves garlic"],["canned tomatoes","400 g tinned tomatoes"],["red wine","100 ml red wine"],["cinnamon","1 tsp cinnamon"],["milk","700 ml milk"],["butter","70 g butter"],["flour","70 g flour"],["egg","2 egg yolks"],["parmesan","60 g kefalotyri or parmesan"]],
  staples:["olive oil","salt","black pepper","nutmeg"],
  steps:["Salt the aubergine slices 30 min, dry, brush with oil and roast at 200 °C until golden, 25 min.","Brown the mince with onion and garlic, add wine, tomatoes and cinnamon, and simmer 30 min until very thick.","Make the béchamel: melt butter, stir in flour, cook 2 min, then whisk in the milk and cook until it coats a spoon. Off the heat beat in the yolks, cheese and nutmeg.","Layer aubergine, meat, aubergine, then flood with béchamel.","Bake 45 min at 180 °C until deep gold. Rest 30 min before cutting or it collapses."]
},
{
  id:"tzatziki", name:"Tzatziki", country:"Greece", flag:"🇬🇷", region:"Europe",
  wiki:"Tzatziki", time:"10 min", diff:"Easy", serves:4, tags:["dip","vegetarian","quick","no-cook"],
  blurb:"Strained yoghurt with cucumber, garlic and dill.",
  history:"Tzatziki is one branch of a Persian-Ottoman family of yoghurt-cucumber dishes that includes Turkish cacık and Iranian mast-o-khiar. The word came into Greek via Turkish from Persian. It cools grilled meat, and in Greece it arrives on almost every meze table.",
  ing:[["yogurt","400 g thick Greek yoghurt"],["cucumber","1 cucumber, grated and squeezed dry"],["garlic","2 cloves garlic, crushed"],["dill","1 tbsp chopped dill"],["olive oil","2 tbsp olive oil"],["vinegar","1 tsp red wine vinegar"]],
  staples:["salt"],
  steps:["Grate the cucumber, salt it, wait 10 min and squeeze out as much water as you can — this decides the texture.","Stir everything together and season.","Rest an hour in the fridge so the garlic mellows into the yoghurt."]
},
{
  id:"goulash", name:"Gulyás (Goulash)", country:"Hungary", flag:"🇭🇺", region:"Europe",
  wiki:"Goulash", time:"2 h 30", diff:"Easy", serves:6, tags:["stew","slow","comfort","one-pot"],
  blurb:"Paprika beef soup-stew from the Hungarian plains.",
  history:"Gulyás means 'herdsman'. Cattle drovers on the Great Hungarian Plain cooked meat in a bogrács cauldron over fire, and when paprika — a New World pepper that reached Hungary via the Ottomans — took hold in the 18th century, the dish became the national symbol it is now. In Hungary gulyás is a soup; the thicker stew foreigners call goulash is closer to pörkölt.",
  ing:[["beef","1 kg beef shin or chuck, cubed"],["onion","3 onions, chopped"],["paprika","3 tbsp sweet Hungarian paprika"],["bell pepper","2 peppers"],["tomato","2 tomatoes"],["potato","3 potatoes, cubed"],["caraway","1 tsp caraway seeds"],["garlic","3 cloves garlic"]],
  staples:["oil","salt","black pepper","water"],
  steps:["Fry the onions slowly in lard or oil until golden, 15 min.","Take the pot off the heat before adding the paprika — burnt paprika is bitter — then stir it through.","Add the beef, caraway, garlic and salt, and just enough water to cover. Simmer, covered, 1½–2 h.","Add peppers, tomato and potato and cook 30 min more until everything is tender.","Serve with bread, or with csipetke (pinched noodles) dropped in at the end."]
},
{
  id:"schnitzel", name:"Wiener Schnitzel", country:"Austria", flag:"🇦🇹", region:"Europe",
  wiki:"Wiener schnitzel", time:"30 min", diff:"Easy", serves:4, tags:["fried","classic","quick"],
  blurb:"Veal beaten thin, breaded, and fried until the crust puffs away from the meat.",
  history:"Vienna's most protected dish — in Austria 'Wiener Schnitzel' may legally mean veal only. A romantic story has Field Marshal Radetzky bringing it from Milan's cotoletta in 1857, but breaded cutlets were recorded in Vienna before that; both cities likely inherited the technique from a wider European habit of gilding food, once literally with gold leaf.",
  ing:[["veal","4 veal escalopes (or pork/chicken)"],["flour","100 g flour"],["egg","2 eggs"],["breadcrumbs","150 g fine breadcrumbs"],["lemon","1 lemon"],["butter","butter or clarified butter for frying"]],
  staples:["salt","black pepper","oil"],
  steps:["Beat the escalopes between clingfilm to 4 mm — thin and even.","Season, then coat in flour, beaten egg and breadcrumbs. Press the crumbs on lightly, never firmly: air is what makes the crust soufflé.","Fry in 1 cm of hot fat, swirling the pan constantly so the fat washes over the top, 2 min each side until golden.","Drain, and serve immediately with lemon and potato salad or parsley potatoes."]
},
{
  id:"borscht", name:"Borscht", country:"Ukraine", flag:"🇺🇦", region:"Europe",
  wiki:"Borscht", time:"1 h 30", diff:"Medium", serves:6, tags:["soup","comfort","winter"],
  blurb:"Deep-red beetroot soup, sour and sweet, finished with soured cream.",
  history:"Borscht was originally made from fermented hogweed stems; beetroot took over in Ukraine and became definitive. UNESCO inscribed Ukrainian borscht culture on its list of intangible heritage in urgent need of safeguarding in 2022. Every household claims a different version — with beans, with pork ribs, with garlic pampushky on the side.",
  ing:[["beetroot","4 beetroots, grated"],["cabbage","¼ head cabbage, shredded"],["potato","3 potatoes, cubed"],["carrot","1 carrot, grated"],["onion","1 onion"],["canned tomatoes","2 tbsp tomato purée"],["beef","500 g beef short rib (optional)"],["vinegar","1 tbsp vinegar"],["garlic","3 cloves garlic"],["dill","bunch dill"],["sour cream","soured cream to serve"]],
  staples:["oil","salt","black pepper","water","sugar"],
  steps:["If using meat, simmer it in 2.5 L water for 1 h to make a broth; otherwise use vegetable stock.","Fry onion and carrot, then add the beetroot, tomato purée, vinegar and a pinch of sugar and stew 15 min. The acid keeps the colour brilliant.","Add potato to the broth, cook 10 min, then the cabbage for 5 min.","Stir in the beetroot mixture and simmer 10 min more — no longer, or the colour fades.","Off the heat add crushed garlic and dill, rest 20 min covered, and serve with soured cream and dark bread."]
},
{
  id:"fish-and-chips", name:"Fish and Chips", country:"United Kingdom", flag:"🇬🇧", region:"Europe",
  wiki:"Fish and chips", time:"50 min", diff:"Medium", serves:2, tags:["fried","seafood","classic"],
  blurb:"Beer-battered white fish with thick-cut chips and vinegar.",
  history:"Fried fish was brought to London by Sephardic Jewish immigrants from Portugal and Spain; the chipped potato came from the industrial north. Their marriage in the 1860s produced Britain's first true fast food, cheap enough to feed factory workers and important enough that fish and chips were never rationed during either world war.",
  ing:[["white fish","2 cod or haddock fillets"],["potato","4 large floury potatoes"],["flour","150 g plain flour + extra to dust"],["beer","200 ml cold beer or sparkling water"],["vinegar","malt vinegar to serve"],["peas","mushy peas to serve"]],
  staples:["salt","oil for frying","baking powder"],
  steps:["Cut the potatoes into thick chips, rinse, and blanch in 140 °C oil for 6 min until soft but pale. Drain and cool.","Whisk flour, ½ tsp baking powder, salt and cold beer into a batter the thickness of double cream. Do not overmix.","Dust the fish in flour, dip in batter, and lower into 180 °C oil. Fry 6–7 min until crisp and deep gold.","Return the chips to the 190 °C oil for 3 min until crunchy.","Salt everything heavily and serve with vinegar and mushy peas."]
},
{
  id:"shepherds-pie", name:"Shepherd's Pie", country:"United Kingdom / Ireland", flag:"🇮🇪", region:"Europe",
  wiki:"Shepherd's pie", time:"1 h 15", diff:"Easy", serves:4, tags:["baked","comfort","budget","leftovers"],
  blurb:"Minced lamb in gravy under a mashed potato roof.",
  history:"The dish appeared in the late 18th century when the potato had taken hold in Britain and Ireland, as a way to use Sunday's leftover roast. The naming rule is strict in Britain: shepherds keep sheep, so shepherd's pie is lamb — with beef it is cottage pie.",
  ing:[["ground beef","600 g lamb mince (beef for cottage pie)"],["onion","1 onion"],["carrot","2 carrots"],["peas","100 g peas"],["stock","400 ml lamb or beef stock"],["worcestershire","1 tbsp Worcestershire sauce"],["potato","1 kg floury potatoes"],["butter","60 g butter"],["milk","100 ml milk"],["thyme","2 sprigs thyme"]],
  staples:["oil","salt","black pepper","flour"],
  steps:["Brown the mince hard, then add onion and carrot and soften 8 min.","Sprinkle over a tbsp of flour, add stock, Worcestershire sauce and thyme, and simmer 25 min until thick. Stir in the peas.","Boil the potatoes, mash with butter and hot milk, season well.","Spread the mash over the meat and rake the top with a fork — the ridges are what crisp.","Bake 25 min at 200 °C until browned and bubbling at the edges."]
},
{
  id:"full-english", name:"Full English Breakfast", country:"United Kingdom", flag:"🇬🇧", region:"Europe",
  wiki:"Full breakfast", time:"25 min", diff:"Easy", serves:2, tags:["breakfast","eggs","one-pan"],
  blurb:"The fried plate: eggs, bacon, sausage, beans, tomato, mushrooms, toast.",
  history:"The cooked breakfast was a Victorian gentry ritual, later adopted and industrialised by the working class and by seaside boarding houses. Its components vary by nation — Irish and Scottish versions add soda bread or tattie scones and black pudding — but the plate's purpose has always been the same: to make the rest of the day optional.",
  ing:[["egg","4 eggs"],["bacon","4 rashers back bacon"],["sausage","4 sausages"],["baked beans","1 tin baked beans"],["tomato","2 tomatoes, halved"],["mushrooms","150 g mushrooms"],["bread","4 slices bread"]],
  staples:["oil","butter","salt","black pepper"],
  steps:["Start the sausages — they take longest, 12–15 min, turning often.","Add the bacon, then the tomatoes cut-side down and the mushrooms.","Warm the beans in a small pan.","Fry the eggs last in the accumulated fat, spooning it over the whites.","Toast and butter the bread and plate everything at once, while it is all still hot."]
},
{
  id:"guacamole", name:"Guacamole", country:"Mexico", flag:"🇲🇽", region:"Americas",
  wiki:"Guacamole", time:"10 min", diff:"Easy", serves:4, tags:["dip","vegan","no-cook","quick"],
  blurb:"Mashed avocado with lime, chilli, onion and coriander.",
  history:"Guacamole is Aztec: the Nahuatl āhuacamolli means 'avocado sauce', and it was recorded by Spanish chroniclers in the 16th century. The avocado itself was domesticated in Mesoamerica thousands of years earlier. The traditional vessel is the molcajete, a volcanic-stone mortar that bruises rather than purées.",
  ing:[["avocado","3 ripe avocados"],["lime","juice of 1 lime"],["onion","¼ white onion, finely diced"],["cilantro","handful coriander, chopped"],["chili","1 serrano or jalapeño chilli, minced"],["tomato","1 tomato, deseeded and diced"]],
  staples:["salt"],
  steps:["Grind the onion, chilli, coriander and salt to a paste in a mortar if you have one.","Add the avocado and mash coarsely — leave it lumpy.","Fold in lime juice and tomato, taste for salt, and serve immediately with warm tortilla chips."]
},
{
  id:"huevos-rancheros", name:"Huevos Rancheros", country:"Mexico", flag:"🇲🇽", region:"Americas",
  wiki:"Huevos rancheros", time:"25 min", diff:"Easy", serves:2, tags:["eggs","breakfast","vegetarian","quick"],
  blurb:"Fried eggs on tortillas under a roasted tomato-chilli salsa.",
  history:"A mid-morning farmhand's breakfast — almuerzo — from rural Mexico, eaten after several hours of work rather than on waking. Its structure is pure milpa: corn tortilla, beans, tomato, chilli, all crops grown together in the same field for millennia.",
  ing:[["tortilla","4 corn tortillas"],["egg","4 eggs"],["tomato","4 tomatoes"],["chili","2 dried or fresh chillies"],["onion","½ onion"],["garlic","2 cloves garlic"],["beans","1 tin black or pinto beans"],["cilantro","coriander"],["feta","crumbled queso fresco or feta"]],
  staples:["oil","salt","black pepper"],
  steps:["Char the tomatoes, chillies, onion and garlic in a dry pan until blackened in patches, then blend to a rough salsa and season.","Simmer the salsa in a little oil for 8 min to deepen it.","Warm the beans and mash lightly.","Fry the tortillas briefly until pliable and slightly crisp, then the eggs sunny side up.","Build: tortilla, beans, egg, hot salsa over the top, cheese and coriander."]
},
{
  id:"chili-con-carne", name:"Chili con Carne", country:"United States (Texas)", flag:"🇺🇸", region:"Americas",
  wiki:"Chili con carne", time:"2 h", diff:"Easy", serves:6, tags:["stew","slow","comfort","one-pot"],
  blurb:"Beef simmered long in a dark chilli sauce.",
  history:"Chili is Texan, from San Antonio, where the 'Chili Queens' sold it from open-air stalls in the plazas from the 1880s. It grew out of Tejano and Canary Islander cooking, and Texas purists insist on 'no beans' — a rule the rest of the world happily ignores. It is the official state dish of Texas.",
  ing:[["beef","1 kg beef chuck, cubed (or mince)"],["onion","2 onions"],["garlic","5 cloves garlic"],["chili powder","3 tbsp chilli powder / ground dried chillies"],["cumin","2 tsp cumin"],["oregano","1 tsp oregano"],["canned tomatoes","400 g tinned tomatoes"],["beans","2 tins kidney beans (optional, non-Texan)"],["stock","500 ml beef stock"],["chocolate","20 g dark chocolate (secret weapon)"]],
  staples:["oil","salt","black pepper"],
  steps:["Brown the beef in batches — crowding the pan steams it.","Soften the onions and garlic, then add the chilli powder, cumin and oregano and toast 1 min.","Return the beef with tomatoes and stock, and simmer very gently 1½–2 h until the meat shreds.","Add the beans, if using, for the last 20 min, and melt in the chocolate.","Rest overnight if possible. Serve with soured cream, lime, cornbread or rice."]
},
{
  id:"mac-and-cheese", name:"Macaroni and Cheese", country:"United States", flag:"🇺🇸", region:"Americas",
  wiki:"Macaroni and cheese", time:"45 min", diff:"Easy", serves:4, tags:["pasta","baked","comfort","kids","vegetarian"],
  blurb:"Baked pasta in cheese sauce with a crisp top.",
  history:"Baked pasta-and-cheese dishes appear in 14th-century Italian and English manuscripts, but the American icon has a specific route: Thomas Jefferson served it at the White House in 1802, and it was his enslaved chef James Hemings, trained in France, who brought the technique to Monticello. It became a cornerstone of African-American soul food cooking and, later, of the boxed-mix era.",
  ing:[["pasta","400 g macaroni"],["butter","50 g butter"],["flour","50 g flour"],["milk","700 ml milk"],["cheddar","350 g mature cheddar, grated"],["mustard","1 tsp English mustard"],["breadcrumbs","60 g breadcrumbs"]],
  staples:["salt","black pepper","nutmeg"],
  steps:["Boil the macaroni two minutes short of done.","Make a roux with butter and flour, cook 2 min, then whisk in the milk gradually to a smooth sauce.","Off the heat stir in most of the cheese, the mustard, nutmeg, salt and pepper. Do not boil after the cheese goes in.","Fold the pasta through and tip into a dish.","Top with the rest of the cheese mixed with breadcrumbs and bake 20–25 min at 200 °C until blistered."]
},
{
  id:"pancakes", name:"American Buttermilk Pancakes", country:"United States", flag:"🇺🇸", region:"Americas",
  wiki:"Pancake", time:"20 min", diff:"Easy", serves:4, tags:["sweet","breakfast","kids","quick"],
  blurb:"Thick, fluffy stacks with butter and maple syrup.",
  history:"Native American cooks made flat cakes from cornmeal long before European settlers arrived with wheat; colonial 'flapjacks' merged the two. The tall, tender modern pancake depends on chemical leavening — baking soda, popularised in the 19th century — and maple syrup, tapped from trees by Indigenous peoples of the northeast for centuries.",
  ing:[["flour","250 g plain flour"],["egg","2 eggs"],["milk","350 ml buttermilk (or milk + 1 tbsp lemon)"],["butter","50 g melted butter"],["sugar","2 tbsp sugar"],["maple syrup","maple syrup to serve"]],
  staples:["baking powder","baking soda","salt"],
  steps:["Whisk flour, sugar, 2 tsp baking powder, ½ tsp bicarbonate of soda and a pinch of salt.","Beat eggs, buttermilk and melted butter, then fold into the dry mix. Stop while it is still lumpy — overmixing makes them tough.","Rest 10 min; the batter should thicken and bubble.","Cook spoonfuls on a medium buttered pan until bubbles break the surface, 2 min, then flip for 1 min.","Stack, butter each layer, and drown in maple syrup."]
},
{
  id:"ceviche", name:"Ceviche", country:"Peru", flag:"🇵🇪", region:"Americas",
  wiki:"Ceviche", time:"20 min", diff:"Easy", serves:4, tags:["seafood","no-cook","fresh","quick"],
  blurb:"Raw fish 'cooked' in lime juice with chilli and red onion.",
  history:"Coastal Peruvians have marinated fish for some two thousand years — the Moche used fermented banana passionfruit juice — but limes arrived with the Spanish and onion with them too, giving today's version. Peru declared ceviche part of its national heritage and celebrates a national ceviche day every 28 June. The leftover marinade, leche de tigre, is drunk as a restorative.",
  ing:[["white fish","600 g very fresh sea bass or sole, cubed"],["lime","juice of 10 limes"],["onion","1 red onion, sliced paper-thin"],["chili","1 ají limo or habanero, minced"],["cilantro","handful coriander"],["sweet potato","1 sweet potato, boiled, to serve"],["corn","boiled corn kernels to serve"]],
  staples:["salt","ice"],
  steps:["Chill everything. Cut the fish into 2 cm cubes and salt it.","Soak the sliced onion in iced water 10 min to tame it.","Pour the lime juice over the fish with the chilli; leave just 2–10 minutes — it should turn opaque at the edge and stay tender inside.","Fold in onion and coriander at the last second.","Serve immediately with sweet potato and corn, which balance the acid."]
},
{
  id:"feijoada", name:"Feijoada", country:"Brazil", flag:"🇧🇷", region:"Americas",
  wiki:"Feijoada", time:"3 h", diff:"Medium", serves:8, tags:["stew","slow","one-pot","weekend"],
  blurb:"Black bean and pork stew with rice, orange and toasted cassava flour.",
  history:"Feijoada is Brazil's national dish, eaten traditionally on Wednesdays and Saturdays. A popular account holds that enslaved people created it from the cuts their enslavers discarded; historians note that bean-and-pork stews were also common in Portugal, and that the Brazilian dish is a fusion born of the plantation kitchen. The orange served alongside is not decoration — it cuts the fat.",
  ing:[["black beans","700 g dried black beans, soaked overnight"],["pork","500 g pork shoulder and ribs"],["sausage","300 g smoked sausage / chorizo"],["bacon","150 g smoked bacon"],["onion","2 onions"],["garlic","6 cloves garlic"],["bay leaf","3 bay leaves"],["orange","2 oranges, to serve"],["rice","rice to serve"]],
  staples:["oil","salt","black pepper","water"],
  steps:["Simmer the drained beans with the bay leaves and the tougher meats in plenty of water, 1½ h.","Add the sausages and bacon and cook another hour until everything is tender and the broth is dark and thick.","Fry onion and garlic in a pan, add a ladle of beans, mash, and return to the pot — this thickens it.","Season and rest at least 30 min.","Serve with white rice, sautéed collard greens, farofa and orange segments."]
},
{
  id:"arroz-con-pollo", name:"Arroz con Pollo", country:"Latin America", flag:"🇨🇴", region:"Americas",
  wiki:"Arroz con pollo", time:"1 h", diff:"Easy", serves:4, tags:["rice","chicken","one-pot","comfort"],
  blurb:"Chicken and rice cooked together in a seasoned sofrito.",
  history:"Arroz con pollo descends directly from Spanish and Moorish rice cookery — rice arrived in Spain with the Arabs, and Spanish colonists carried the pilaf idea to the Caribbean and Latin America, where achiote, peppers and beer entered the pot. Nearly every country from Cuba to Peru claims a version.",
  ing:[["chicken thighs","8 chicken thighs"],["rice","400 g long-grain rice"],["onion","1 onion"],["bell pepper","1 red pepper"],["garlic","4 cloves garlic"],["canned tomatoes","2 tomatoes, chopped"],["stock","800 ml chicken stock"],["cumin","1 tsp cumin"],["turmeric","½ tsp turmeric or achiote"],["peas","150 g peas"],["cilantro","coriander to finish"]],
  staples:["oil","salt","black pepper"],
  steps:["Season and brown the chicken skin-side down; set aside.","Make a sofrito: onion, pepper, garlic and tomato cooked down 10 min with cumin and turmeric.","Stir in the rice to coat, add the hot stock, and settle the chicken back on top.","Cover and cook on low 20 min without stirring, then scatter over the peas and rest, covered, 10 min.","Fork through, finish with coriander and lime."]
},
{
  id:"tikka-masala", name:"Chicken Tikka Masala", country:"India / United Kingdom", flag:"🇮🇳", region:"South Asia",
  wiki:"Chicken tikka masala", time:"45 min + marinate", diff:"Medium", serves:4, tags:["curry","chicken","comfort"],
  blurb:"Grilled spiced chicken in a creamy tomato gravy.",
  history:"Chicken tikka is Punjabi tandoor cooking; the masala sauce around it is almost certainly British. The best-known origin story places it in Glasgow in the 1970s, where a chef supposedly answered a customer's complaint of dryness by improvising a sauce from tomato soup and spices. In 2001 the British foreign secretary called it 'a true British national dish' — a claim about migration as much as food.",
  ing:[["chicken thighs","800 g boneless chicken thighs, cubed"],["yogurt","150 g yoghurt"],["garam masala","2 tsp garam masala"],["ginger","2 tbsp ginger paste"],["garlic","2 tbsp garlic paste"],["canned tomatoes","400 g tinned tomatoes or passata"],["cream","150 ml double cream"],["butter","50 g butter"],["cumin","1 tsp cumin"],["coriander seed","1 tsp ground coriander"],["turmeric","½ tsp turmeric"],["chili powder","1 tsp kashmiri chilli powder"]],
  staples:["oil","salt"],
  steps:["Marinate the chicken in yoghurt, half the ginger-garlic, chilli powder, turmeric and salt for 4 h or overnight.","Grill or roast the chicken at high heat until charred at the edges but not dried out.","In butter, cook the rest of the ginger-garlic, then the ground spices, 1 min.","Add tomatoes and simmer 15 min until the oil separates at the edges — this is the sign the gravy is ready.","Blend smooth if you like, stir in cream and garam masala, then fold in the chicken and warm through.","Serve with naan or basmati rice."]
},
{
  id:"dal-tadka", name:"Dal Tadka", country:"India", flag:"🇮🇳", region:"South Asia",
  wiki:"Dal", time:"40 min", diff:"Easy", serves:4, tags:["vegetarian","budget","comfort","one-pot"],
  blurb:"Yellow lentils finished with spices bloomed in hot ghee.",
  history:"Dal is the daily backbone of the Indian subcontinent and among the oldest continuously cooked dishes anywhere — lentils were domesticated nearby some 9,000 years ago. The tadka (or chhonk) — whole spices sizzled in fat and poured over at the end — is a technique, not a recipe, and it is what separates a dull pot of lentils from a great one.",
  ing:[["lentils","250 g toor dal or red lentils"],["turmeric","½ tsp turmeric"],["onion","1 onion, chopped"],["tomato","2 tomatoes, chopped"],["garlic","4 cloves garlic, sliced"],["ginger","1 tbsp grated ginger"],["cumin","1 tsp cumin seeds"],["mustard seeds","½ tsp mustard seeds"],["chili","2 dried red chillies"],["ghee","2 tbsp ghee or butter"],["cilantro","coriander to finish"]],
  staples:["salt","water"],
  steps:["Rinse the dal and boil with turmeric, salt and 1 L water until collapsing, 25–30 min (or 8 min in a pressure cooker). Whisk it smooth.","Separately fry onion, ginger and tomato until soft and stir into the dal. Loosen with water to a pourable consistency.","For the tadka: heat ghee, add cumin and mustard seeds until they pop, then garlic and dried chillies until the garlic is gold.","Pour the sizzling tadka over the dal — it should hiss.","Stir once, finish with coriander and lemon, and eat with rice or roti."]
},
{
  id:"chana-masala", name:"Chana Masala", country:"India", flag:"🇮🇳", region:"South Asia",
  wiki:"Chana masala", time:"35 min", diff:"Easy", serves:4, tags:["vegan","curry","budget"],
  blurb:"Chickpeas in a dark, tangy onion-tomato masala.",
  history:"A Punjabi and Delhi street staple, usually paired with fried bhatura bread as chole bhature. Its characteristic dark colour and sourness traditionally come from cooking the chickpeas with tea leaves or amla, and from amchoor — dried green mango powder — a souring agent used across northern India.",
  ing:[["chickpeas","2 tins chickpeas (or 250 g dried, soaked)"],["onion","2 onions, finely chopped"],["tomato","3 tomatoes, puréed"],["ginger","1 tbsp ginger"],["garlic","4 cloves garlic"],["cumin","1 tsp cumin seeds"],["coriander seed","2 tsp ground coriander"],["garam masala","1 tsp garam masala"],["turmeric","½ tsp turmeric"],["chili powder","1 tsp chilli powder"],["lemon","juice of ½ lemon"]],
  staples:["oil","salt","water"],
  steps:["Fry cumin seeds in oil until fragrant, then brown the onions properly — 12 min, until they are genuinely dark.","Add ginger and garlic, then the ground spices, and cook 1 min.","Add the tomato purée and cook until it thickens and the oil separates.","Tip in the chickpeas with a splash of their liquid and simmer 15 min, mashing a few against the side to thicken.","Finish with garam masala, lemon and coriander. Serve with rice, roti or bhatura."]
},
{
  id:"aloo-gobi", name:"Aloo Gobi", country:"India", flag:"🇮🇳", region:"South Asia",
  wiki:"Aloo gobi", time:"35 min", diff:"Easy", serves:4, tags:["vegan","budget","dry curry"],
  blurb:"Dry-spiced potato and cauliflower, turmeric-yellow.",
  history:"A Punjabi home dish of the everyday kind — a sabzi, cooked dry so it can be scooped with roti and carried in a lunch tin. Cauliflower reached India through Portuguese and later British introduction in the 19th century and was absorbed so completely that it now feels indigenous.",
  ing:[["potato","3 potatoes, cubed"],["cauliflower","1 cauliflower, in florets"],["onion","1 onion"],["ginger","1 tbsp ginger"],["cumin","1 tsp cumin seeds"],["turmeric","1 tsp turmeric"],["coriander seed","1 tsp ground coriander"],["garam masala","½ tsp garam masala"],["chili","1 green chilli"],["cilantro","coriander leaves"]],
  staples:["oil","salt"],
  steps:["Fry cumin seeds in hot oil, add onion, ginger and green chilli and cook until soft.","Stir in turmeric and ground coriander, then the potatoes. Cook 5 min.","Add the cauliflower, salt, and 3 tbsp water. Cover and steam on low 15–20 min, shaking rather than stirring so the florets stay whole.","Uncover, raise the heat to drive off moisture and catch some colour.","Finish with garam masala and coriander."]
},
{
  id:"biryani", name:"Chicken Biryani", country:"India", flag:"🇮🇳", region:"South Asia",
  wiki:"Biryani", time:"1 h 30", diff:"Hard", serves:6, tags:["rice","chicken","celebration","slow"],
  blurb:"Layered rice and marinated meat sealed and steamed together.",
  history:"Biryani descends from Persian pilaf, arriving with Mughal and earlier Muslim courts; the name comes from the Persian birinj (rice) or biryan (fried before cooking). Hyderabad, Lucknow, Kolkata, Malabar and Sindh each defend a distinct style. The dum technique — sealing the pot with dough so nothing escapes — is what makes it biryani rather than pilau.",
  ing:[["chicken thighs","1 kg chicken, bone-in"],["rice","500 g basmati rice"],["yogurt","250 g yoghurt"],["onion","4 onions, sliced and fried crisp"],["ginger","2 tbsp ginger paste"],["garlic","2 tbsp garlic paste"],["garam masala","2 tsp garam masala"],["saffron","pinch saffron in warm milk"],["mint","handful mint"],["cilantro","handful coriander"],["ghee","4 tbsp ghee"],["cinnamon","cinnamon, cardamom, cloves, bay"]],
  staples:["salt","oil","water"],
  steps:["Marinate the chicken in yoghurt, ginger-garlic, spices, half the fried onions, herbs and salt for at least 2 h.","Parboil the rice with whole spices and plenty of salt until 70% done — it must still snap in the middle. Drain.","Spread the marinated chicken in a heavy pot, layer the rice over it, then the remaining fried onions, herbs, saffron milk and ghee.","Seal the lid with dough or foil. Cook 10 min on high, then 35–40 min on the lowest possible heat (use a heat diffuser or tawa).","Rest 15 min, then open at the table and fold gently from the bottom so the layers show.","Serve with raita and a squeeze of lemon."]
},
{
  id:"pad-thai", name:"Pad Thai", country:"Thailand", flag:"🇹🇭", region:"East & Southeast Asia",
  wiki:"Pad thai", time:"30 min", diff:"Medium", serves:2, tags:["noodles","street food","quick"],
  blurb:"Stir-fried rice noodles with tamarind, egg, peanuts and lime.",
  history:"Pad Thai is deliberately modern: in the late 1930s and 40s the government of Plaek Phibunsongkhram promoted it nationwide as part of a nation-building campaign — to modernise Thai identity, reduce rice consumption and support the domestic noodle industry. Recipes were distributed by the state. A dish invented as policy became the country's global ambassador.",
  ing:[["rice noodles","200 g flat rice noodles"],["tamarind","3 tbsp tamarind paste"],["fish sauce","3 tbsp fish sauce"],["palm sugar","3 tbsp palm sugar"],["egg","2 eggs"],["shrimp","200 g prawns or firm tofu"],["bean sprouts","150 g bean sprouts"],["spring onion","3 spring onions"],["peanuts","50 g roasted peanuts, crushed"],["lime","lime wedges"],["garlic","3 cloves garlic"]],
  staples:["oil","chili flakes"],
  steps:["Soak the noodles in warm water until pliable but not soft, 20 min. Drain.","Melt the palm sugar with tamarind and fish sauce into a sauce; it should be sour, salty and sweet in that order.","Get the wok very hot. Fry garlic and prawns, push aside, scramble the eggs.","Add the drained noodles and sauce and toss constantly for 2 min until they absorb the sauce and soften.","Throw in the bean sprouts and spring onion for 30 seconds only.","Serve with peanuts, chilli flakes and lime on the side, so each person seasons their own."]
},
{
  id:"green-curry", name:"Thai Green Curry", country:"Thailand", flag:"🇹🇭", region:"East & Southeast Asia",
  wiki:"Green curry", time:"35 min", diff:"Medium", serves:4, tags:["curry","coconut","quick"],
  blurb:"Coconut curry built on a pounded paste of green chillies and aromatics.",
  history:"Kaeng khiao wan — 'sweet green curry' — was documented in central Thailand in the early 20th century. Its colour comes from fresh green chillies rather than dried red ones, and its structure from a Thai curry paste pounded in a granite mortar. Coconut milk, sugar and fish sauce set the balance that defines Thai cooking: hot, sweet, salty, sour.",
  ing:[["green curry paste","3 tbsp green curry paste"],["coconut milk","400 ml coconut milk"],["chicken thighs","500 g chicken thighs, sliced (or tofu)"],["thai eggplant","150 g Thai aubergines or courgette"],["fish sauce","2 tbsp fish sauce"],["palm sugar","1 tbsp palm sugar"],["basil","handful Thai basil"],["kaffir lime","3 kaffir lime leaves"],["bamboo shoots","100 g bamboo shoots (optional)"]],
  staples:["oil"],
  steps:["Simmer the thick cream from the top of the coconut milk until it splits and the oil rises, 3 min.","Fry the curry paste in that oil until deeply fragrant, 2–3 min — this step decides the whole dish.","Add the chicken and seal, then the rest of the coconut milk.","Add the vegetables, fish sauce, sugar and torn lime leaves; simmer 10–12 min.","Take off the heat, stir in Thai basil, and serve with jasmine rice."]
},
{
  id:"tom-yum", name:"Tom Yum Goong", country:"Thailand", flag:"🇹🇭", region:"East & Southeast Asia",
  wiki:"Tom yum", time:"25 min", diff:"Easy", serves:4, tags:["soup","seafood","quick","spicy"],
  blurb:"Hot-and-sour prawn soup with lemongrass, galangal and lime leaf.",
  history:"Tom yum is central Thai river-country cooking — tom means to boil, yam a sour-spicy salad — and it was traditionally made with freshwater prawns from the Chao Phraya. UNESCO inscribed tom yum kung on its intangible heritage list in 2024. The aromatics are meant to be left in the bowl to perfume it, not eaten.",
  ing:[["shrimp","400 g prawns, shells kept"],["lemongrass","3 stalks lemongrass, bruised"],["galangal","6 slices galangal"],["kaffir lime","5 kaffir lime leaves, torn"],["mushrooms","200 g straw or oyster mushrooms"],["fish sauce","3 tbsp fish sauce"],["lime","juice of 2–3 limes"],["chili","4 bird's eye chillies, crushed"],["cilantro","coriander to finish"]],
  staples:["water","sugar"],
  steps:["Make a quick stock by simmering the prawn shells in 1.2 L water for 10 min, then strain.","Add lemongrass, galangal and lime leaves and simmer 5 min.","Add mushrooms and chillies, then the prawns, and cook just until they turn pink, 2 min.","Take off the heat before adding fish sauce and lime juice — boiling lime juice turns it bitter.","Taste: it should be sharply sour, then hot, then salty. Finish with coriander."]
},
{
  id:"fried-rice", name:"Yangzhou Fried Rice", country:"China", flag:"🇨🇳", region:"East & Southeast Asia",
  wiki:"Fried rice", time:"15 min", diff:"Easy", serves:2, tags:["rice","quick","leftovers","budget","one-pan"],
  blurb:"Day-old rice tossed hot with egg, peas and whatever you have.",
  history:"Fried rice is a lesson in thrift that became a craft: cold leftover rice, dried out overnight, is the only rice that fries properly. The Yangzhou style from Jiangsu — with prawns, ham and egg — is the best known, and Cantonese chefs prize wok hei, the 'breath of the wok', a seared aroma only very high heat produces.",
  ing:[["rice","600 g cold cooked rice (a day old)"],["egg","3 eggs"],["peas","100 g peas"],["carrot","1 carrot, finely diced"],["spring onion","4 spring onions"],["shrimp","150 g small prawns or diced ham"],["soy sauce","2 tbsp light soy sauce"],["sesame oil","1 tsp sesame oil"],["ginger","1 tsp grated ginger"]],
  staples:["oil","salt","white pepper"],
  steps:["Break up the cold rice with wet hands so no clumps remain.","Heat the wok until it smokes. Scramble the eggs quickly in oil and remove while still soft.","Fry ginger, carrot, prawns and peas for 1 min.","Add the rice and press it against the hot metal, tossing repeatedly for 3 min until the grains dance and separate.","Return the egg, splash the soy down the side of the hot wok, add sesame oil, white pepper and spring onions, toss once and serve."]
},
{
  id:"kung-pao", name:"Kung Pao Chicken", country:"China", flag:"🇨🇳", region:"East & Southeast Asia",
  wiki:"Kung Pao chicken", time:"25 min", diff:"Medium", serves:3, tags:["stir-fry","chicken","quick","spicy"],
  blurb:"Sichuan stir-fry of chicken, dried chillies, peanuts and numbing pepper.",
  history:"Named for Ding Baozhen, a 19th-century governor of Sichuan whose honorary title was Gongbao — 'palace guardian'. The dish was renamed during the Cultural Revolution to erase its feudal association, then quietly restored. Authentic versions carry málà, the tingling numbness of Sichuan peppercorn, which the Western sweet-and-sour version drops entirely.",
  ing:[["chicken thighs","500 g chicken thigh, diced"],["peanuts","80 g roasted peanuts"],["dried chili","10 dried red chillies"],["sichuan pepper","1 tsp Sichuan peppercorns"],["soy sauce","2 tbsp soy sauce"],["vinegar","2 tbsp Chinkiang black vinegar"],["sugar","1 tbsp sugar"],["garlic","4 cloves garlic"],["ginger","1 tbsp ginger"],["spring onion","4 spring onions, in batons"],["cornstarch","2 tsp cornflour"]],
  staples:["oil","salt","water"],
  steps:["Marinate the diced chicken 15 min in 1 tbsp soy, 1 tsp cornflour and a splash of water.","Mix the sauce: remaining soy, vinegar, sugar, 1 tsp cornflour and 3 tbsp water.","In hot oil, fry the dried chillies and Sichuan peppercorns for 20 seconds until fragrant but not black.","Add the chicken and sear without moving for 1 min, then stir-fry until just cooked.","Add garlic, ginger and spring onion, then pour in the sauce and let it thicken and glaze, 30 s.","Stir in the peanuts off the heat so they stay crunchy."]
},
{
  id:"mapo-tofu", name:"Mapo Tofu", country:"China", flag:"🇨🇳", region:"East & Southeast Asia",
  wiki:"Mapo doufu", time:"25 min", diff:"Easy", serves:3, tags:["tofu","quick","spicy"],
  blurb:"Silken tofu in a fiery, numbing bean-paste sauce.",
  history:"Chengdu, 1860s: the story goes that a pockmarked woman — má pó — ran a small restaurant near a bridge and cooked this for oil porters who brought their own ingredients. It is the flagship of Sichuan's málà flavour, and its soul is doubanjiang, the fermented broad-bean chilli paste of Pixian county, aged for years.",
  ing:[["tofu","500 g silken or soft tofu, cubed"],["ground beef","150 g minced pork or beef"],["doubanjiang","2 tbsp doubanjiang (chilli bean paste)"],["fermented black beans","1 tbsp fermented black beans"],["sichuan pepper","1 tsp ground Sichuan pepper"],["garlic","3 cloves garlic"],["ginger","1 tbsp ginger"],["stock","250 ml stock"],["cornstarch","2 tsp cornflour"],["spring onion","3 spring onions"],["chili powder","1 tsp chilli flakes"]],
  staples:["oil","soy sauce"],
  steps:["Slip the tofu cubes into salted simmering water for 2 min — this firms them so they survive stirring. Drain.","Brown the mince in oil until crisp at the edges.","Lower the heat and fry the doubanjiang until the oil turns red, then add black beans, garlic, ginger and chilli.","Pour in the stock, slide in the tofu, and simmer 4 min. Push, don't stir, to keep the cubes whole.","Thicken in two stages with cornflour slurry until glossy.","Finish with ground Sichuan pepper and spring onion. Serve with plain rice."]
},
{
  id:"miso-soup", name:"Miso Soup", country:"Japan", flag:"🇯🇵", region:"East & Southeast Asia",
  wiki:"Miso soup", time:"15 min", diff:"Easy", serves:4, tags:["soup","quick","breakfast","vegetarian"],
  blurb:"Dashi broth clouded with fermented soybean paste.",
  history:"Miso arrived from China with Buddhism and by the Muromachi period was daily food; the phrase ichiju-issai — one soup, one dish — describes the minimal Japanese meal built around it. It is still the standard Japanese breakfast, and the rule is absolute: never boil the soup after the miso goes in, or the aroma and live cultures are lost.",
  ing:[["dashi","1 L dashi (kombu + bonito)"],["miso","4 tbsp miso paste"],["tofu","200 g silken tofu, cubed"],["wakame","2 tbsp dried wakame"],["spring onion","2 spring onions"]],
  staples:["water"],
  steps:["Make dashi: steep kombu in water 30 min, heat to just below boiling, remove the kombu, add bonito flakes, steep 2 min, strain.","Soak the wakame in cold water until it unfurls, 5 min.","Warm the dashi, add tofu and wakame.","Slake the miso with a ladle of hot broth in a small bowl, then stir it back in off the boil.","Serve at once, scattered with spring onion."]
},
{
  id:"katsu-curry", name:"Chicken Katsu Curry", country:"Japan", flag:"🇯🇵", region:"East & Southeast Asia",
  wiki:"Japanese curry", time:"50 min", diff:"Medium", serves:4, tags:["curry","fried","comfort"],
  blurb:"Crisp panko cutlet over rice with thick, mild Japanese curry sauce.",
  history:"Curry reached Japan not from India but from the British Royal Navy in the Meiji era, which is why it is thickened with a roux and eaten with a spoon. The Imperial Japanese Navy adopted it to prevent beriberi, and it spread from there into schools and homes. Katsu — from the English 'cutlet' — is a parallel import, part of the yōshoku tradition of Westernised Japanese cooking.",
  ing:[["chicken breast","4 chicken breasts"],["flour","flour to coat"],["egg","2 eggs"],["panko","200 g panko breadcrumbs"],["onion","2 onions"],["carrot","2 carrots"],["potato","2 potatoes"],["curry powder","2 tbsp curry powder"],["garam masala","1 tsp garam masala"],["stock","800 ml chicken stock"],["butter","40 g butter"],["rice","rice to serve"]],
  staples:["oil","salt","black pepper","flour","soy sauce"],
  steps:["For the sauce, brown onion in butter 10 min, add carrot and potato, then stir in 3 tbsp flour and the curry powder and cook 2 min.","Whisk in the stock gradually, add a splash of soy, and simmer 20 min until thick and glossy.","Flatten the chicken slightly, season, and coat in flour, egg and panko.","Shallow-fry 4 min a side until deep gold, then rest and slice into thick fingers.","Serve the sliced katsu over rice with the sauce poured beside it, and pickles on the side."]
},
{
  id:"onigiri", name:"Onigiri", country:"Japan", flag:"🇯🇵", region:"East & Southeast Asia",
  wiki:"Onigiri", time:"20 min", diff:"Easy", serves:4, tags:["rice","snack","lunchbox","budget"],
  blurb:"Hand-pressed rice triangles with a savoury filling and a nori belt.",
  history:"Carbonised rice balls have been excavated from Japanese sites nearly two thousand years old. Onigiri were samurai field rations and are now the most-sold item in Japanese convenience stores, where a clever wrapper keeps the nori separate until the moment you open it, so it stays crisp.",
  ing:[["rice","500 g cooked Japanese short-grain rice, warm"],["nori","4 sheets nori, cut in strips"],["salmon","1 grilled salmon fillet, flaked (or tuna mayo)"],["sesame seeds","1 tbsp toasted sesame seeds"],["umeboshi","umeboshi plums (optional)"]],
  staples:["salt","water"],
  steps:["Wet your hands and rub them with salt — this seasons the rice and stops it sticking.","Take a handful of warm rice, flatten it, put a little filling in the centre.","Fold the rice over and press into a triangle with firm, even pressure — firm enough to hold, loose enough to eat.","Wrap a strip of nori around the base and sprinkle with sesame.","Eat within a few hours; onigiri are never refrigerated in Japan."]
},
{
  id:"bibimbap", name:"Bibimbap", country:"South Korea", flag:"🇰🇷", region:"East & Southeast Asia",
  wiki:"Bibimbap", time:"50 min", diff:"Medium", serves:4, tags:["rice","vegetables","colourful"],
  blurb:"Rice topped with separately seasoned vegetables, egg and gochujang, mixed at the table.",
  history:"The name simply means 'mixed rice'. One theory ties it to ancestral rites, where the offerings were combined and eaten together; another to farmers eating everything from one bowl in the fields. Jeonju's version is the most celebrated. The arrangement is deliberate — five colours representing the five elements — and it is meant to be destroyed with a spoon before eating.",
  ing:[["rice","600 g cooked short-grain rice"],["spinach","200 g spinach"],["carrot","2 carrots, julienned"],["bean sprouts","200 g bean sprouts"],["mushrooms","150 g shiitake mushrooms"],["zucchini","1 courgette"],["egg","4 eggs"],["ground beef","250 g beef mince"],["gochujang","4 tbsp gochujang"],["sesame oil","3 tbsp sesame oil"],["soy sauce","3 tbsp soy sauce"],["garlic","4 cloves garlic"],["sesame seeds","sesame seeds"]],
  staples:["oil","salt","sugar"],
  steps:["Season each vegetable separately: blanch the spinach and bean sprouts and dress with sesame oil, garlic and salt; stir-fry the carrot, courgette and mushrooms one at a time.","Marinate the beef in soy, garlic, sesame oil and a little sugar, then fry hard.","Mix the gochujang with a spoon of sesame oil and a little sugar and water into a sauce.","Fill each bowl with hot rice and arrange the toppings in neat wedges by colour.","Crown with a fried egg, add the sauce, and mix vigorously at the table before eating.","For dolsot bibimbap, use a preheated stone bowl so the bottom layer of rice crisps."]
},
{
  id:"kimchi-fried-rice", name:"Kimchi Bokkeumbap", country:"South Korea", flag:"🇰🇷", region:"East & Southeast Asia",
  wiki:"Kimchi fried rice", time:"15 min", diff:"Easy", serves:2, tags:["rice","quick","leftovers","budget","one-pan"],
  blurb:"Sour aged kimchi fried into rice, topped with a runny egg.",
  history:"Kimchi has been made in Korea for well over a thousand years, and kimjang — the communal late-autumn making of it — is UNESCO-listed. This dish exists because of what happens next: kimchi that has fermented past the point of pleasant crunch becomes sour and deep, and frying it is the classic rescue. It is Korean home cooking at its most everyday.",
  ing:[["kimchi","300 g well-fermented kimchi, chopped"],["rice","500 g cold cooked rice"],["egg","2 eggs"],["gochujang","1 tbsp gochujang"],["sesame oil","1 tbsp sesame oil"],["spring onion","3 spring onions"],["nori","nori strips"],["bacon","100 g bacon or spam, diced (optional)"]],
  staples:["oil","soy sauce","sugar"],
  steps:["Fry the bacon, if using, until crisp, then add the kimchi and fry 4 min until the edges caramelise — do not rush this.","Stir in the gochujang and a splash of the kimchi brine.","Add the cold rice and toss over high heat until every grain is coated and orange.","Season with a little soy and sesame oil.","Fry the eggs sunny side up and lay one on each portion; top with nori and spring onion."]
},
{
  id:"pho", name:"Phở Bò", country:"Vietnam", flag:"🇻🇳", region:"East & Southeast Asia",
  wiki:"Pho", time:"5 h", diff:"Hard", serves:6, tags:["soup","noodles","slow","weekend"],
  blurb:"Clear charred-spice beef broth over rice noodles with a plate of herbs.",
  history:"Phở emerged in northern Vietnam around Hanoi in the early 20th century, shaped by Chinese noodle soups and by French demand for beef, which made bones cheaply available — the name may even come from the French pot-au-feu. After 1954 refugees carried it south, where it grew sweeter and gained the herb plate, and after 1975 the diaspora carried it worldwide.",
  ing:[["beef bones","2 kg beef bones"],["beef","500 g brisket + 200 g raw sirloin, sliced paper-thin"],["rice noodles","500 g flat rice noodles"],["onion","2 onions, halved"],["ginger","1 large piece ginger"],["star anise","5 star anise"],["cinnamon","1 cinnamon stick"],["cloves","4 cloves"],["coriander seed","1 tbsp coriander seeds"],["fish sauce","4 tbsp fish sauce"],["cilantro","coriander, Thai basil, mint"],["bean sprouts","bean sprouts and lime to serve"]],
  staples:["salt","sugar","water"],
  steps:["Parboil the bones 10 min, drain, rinse — this is what makes the broth clear — then cover with fresh water.","Char the onion and ginger directly over a flame until blackened, and toast the whole spices in a dry pan.","Add them to the pot and simmer, never boil, for 4–6 hours, skimming often.","Strain, then season with fish sauce, salt and a little rock sugar until it tastes deep and rounded.","Soften the noodles, put them in bowls with cooked brisket and raw sliced sirloin.","Pour the broth over boiling hot so the raw beef cooks in the bowl. Serve with herbs, sprouts, lime and chilli."]
},
{
  id:"banh-mi", name:"Bánh Mì Thịt", country:"Vietnam", flag:"🇻🇳", region:"East & Southeast Asia",
  wiki:"Bánh mì", time:"25 min", diff:"Easy", serves:2, tags:["sandwich","street food","quick"],
  blurb:"A crackling baguette filled with pâté, pork, pickles and coriander.",
  history:"Bánh mì is colonialism turned into lunch: the French brought the baguette, and Vietnamese bakers made it lighter with rice flour, giving a shatteringly thin crust. After 1954 Saigon vendors filled it with pâté, mayonnaise, cold cuts, pickled daikon and carrot, chilli and coriander — a sandwich that balances every element against the others.",
  ing:[["baguette","2 short baguettes"],["pork","200 g grilled pork or cold cuts"],["pate","3 tbsp pork pâté"],["mayonnaise","3 tbsp mayonnaise"],["carrot","1 carrot, julienned"],["daikon","150 g daikon, julienned"],["cucumber","½ cucumber, in batons"],["cilantro","large handful coriander"],["chili","1 red chilli, sliced"],["vinegar","4 tbsp rice vinegar"]],
  staples:["sugar","salt","soy sauce"],
  steps:["Pickle the carrot and daikon in vinegar, 2 tbsp sugar and 1 tsp salt for at least 30 min.","Warm the baguettes in a hot oven 4 min so the crust crackles, then split without cutting all the way through.","Spread pâté on one side, mayonnaise on the other.","Layer in the meat, then the drained pickles, cucumber, chilli and a lot of coriander.","Season with a few drops of soy or Maggi and press closed."]
},
{
  id:"nasi-goreng", name:"Nasi Goreng", country:"Indonesia", flag:"🇮🇩", region:"East & Southeast Asia",
  wiki:"Nasi goreng", time:"20 min", diff:"Easy", serves:2, tags:["rice","quick","leftovers","one-pan"],
  blurb:"Sweet-soy fried rice with a fried egg and prawn crackers.",
  history:"Fried rice came to the Indonesian archipelago through centuries of Chinese trade, then took on a distinctly local character with kecap manis — the thick sweet soy sauce developed in Java — and terasi shrimp paste. It is eaten at any hour, and a plate for breakfast is entirely normal. In 2011 an online poll placed it second among the world's most delicious foods.",
  ing:[["rice","500 g cold cooked rice"],["kecap manis","3 tbsp kecap manis (sweet soy)"],["shallot","4 shallots"],["garlic","3 cloves garlic"],["chili","2 red chillies"],["shrimp paste","1 tsp shrimp paste (terasi)"],["egg","2 eggs"],["chicken breast","150 g chicken or prawns"],["spring onion","2 spring onions"],["cucumber","cucumber slices to serve"]],
  staples:["oil","salt"],
  steps:["Pound shallots, garlic, chilli and shrimp paste into a rough paste (bumbu).","Fry the paste in oil until it smells sweet and toasted, 2 min.","Add the chicken or prawns and cook through.","Add the cold rice and kecap manis and stir-fry hard until every grain is glossy and dark.","Top each plate with a crisp fried egg, and serve with cucumber, tomato and prawn crackers."]
},
{
  id:"adobo", name:"Chicken Adobo", country:"Philippines", flag:"🇵🇭", region:"East & Southeast Asia",
  wiki:"Philippine adobo", time:"50 min", diff:"Easy", serves:4, tags:["braise","one-pot","budget","comfort"],
  blurb:"Chicken braised in vinegar, soy, garlic and bay until glazed.",
  history:"Filipinos were cooking meat in vinegar and salt long before contact with Spain — vinegar preserves food in a tropical climate. Spanish colonisers named the technique adobo, from adobar, to marinate, and soy sauce arrived through Chinese trade. It is the closest thing the Philippines has to a national dish, and every family's version is the correct one.",
  ing:[["chicken thighs","1 kg chicken thighs and drumsticks"],["vinegar","120 ml cane or white vinegar"],["soy sauce","120 ml soy sauce"],["garlic","1 whole head garlic, crushed"],["bay leaf","4 bay leaves"],["black peppercorns","1 tbsp whole black peppercorns"],["sugar","1 tbsp brown sugar"],["rice","rice to serve"]],
  staples:["oil","water"],
  steps:["Marinate the chicken in soy, garlic, bay and peppercorns for 30 min or overnight.","Brown the chicken skin-side down in a little oil, then return the marinade.","Add the vinegar and — crucially — let it boil hard for 2 minutes without stirring, to cook off the raw sharpness.","Add a splash of water, cover, and simmer 25 min until tender.","Uncover, add the sugar and reduce the sauce until it clings and turns glossy.","Serve with plenty of white rice; it is better the next day."]
},
{
  id:"jollof", name:"Jollof Rice", country:"Nigeria / West Africa", flag:"🇳🇬", region:"Africa",
  wiki:"Jollof rice", time:"1 h", diff:"Medium", serves:6, tags:["rice","one-pot","party"],
  blurb:"Rice cooked in a rich pepper-and-tomato stew until smoky at the base.",
  history:"Jollof traces to the Wolof people of the Senegambia region and their thieboudienne, a rice-and-fish dish that spread across West Africa along trade routes. Every country claims the best version, and the 'Jollof Wars' between Nigeria and Ghana are a genuine, if affectionate, cultural rivalry. The prized note is the faint smokiness from the slightly scorched bottom of the pot.",
  ing:[["rice","500 g long-grain parboiled rice"],["canned tomatoes","400 g tinned tomatoes"],["bell pepper","2 red peppers"],["scotch bonnet","1–2 scotch bonnet chillies"],["onion","2 onions"],["tomato paste","3 tbsp tomato purée"],["stock","700 ml chicken stock"],["thyme","1 tsp thyme"],["curry powder","1 tbsp curry powder"],["bay leaf","2 bay leaves"]],
  staples:["oil","salt","black pepper"],
  steps:["Blend the tomatoes, peppers, scotch bonnet and one onion into a smooth base.","Fry the second onion in oil, add the tomato purée and cook it dark, 5 min.","Pour in the blended base and fry it down hard, 20–25 min, until it thickens and the oil rises. This step is the whole dish — do not shorten it.","Add stock, thyme, curry powder and bay, then the washed rice. The liquid should barely cover it.","Cover tightly (foil under the lid) and cook on the lowest heat 25–30 min without stirring.","Let the base catch very slightly for the smoky note, then fluff and serve with fried plantain and chicken."]
},
{
  id:"doro-wat", name:"Doro Wat", country:"Ethiopia", flag:"🇪🇹", region:"Africa",
  wiki:"Doro wat", time:"2 h 30", diff:"Medium", serves:6, tags:["stew","slow","spicy","celebration"],
  blurb:"Deep red chicken stew on berbere and slow-melted onions, with whole eggs.",
  history:"Doro wat is Ethiopia's festival dish, cooked for Christmas (Genna), Easter and important guests, and served on injera, the sour teff flatbread that doubles as plate and cutlery. Its foundation is an extraordinary quantity of onions cooked dry before any fat is added, plus berbere — a chilli and spice blend whose recipe is a household signature. The hard-boiled eggs and drumsticks are portioned by seniority.",
  ing:[["chicken thighs","1.5 kg chicken drumsticks and thighs"],["onion","1.5 kg red onions, very finely chopped"],["berbere","5 tbsp berbere spice"],["niter kibbeh","150 g niter kibbeh (spiced clarified butter) or ghee"],["garlic","6 cloves garlic"],["ginger","2 tbsp ginger"],["egg","6 hard-boiled eggs"],["lemon","juice of 1 lemon"],["injera","injera or flatbread to serve"]],
  staples:["salt","black pepper","water"],
  steps:["Cook the onions in a dry pot over low heat for 45 minutes, stirring, until they collapse into a paste. No oil yet.","Stir in the niter kibbeh, then the garlic, ginger and berbere, and cook 15 min more until darkly aromatic.","Rub the chicken with lemon and salt, add it to the pot with a little water, and simmer covered 45 min.","Score the boiled eggs lightly and add them for the last 15 min so they take on the colour.","The sauce should be thick and glossy with red butter at the surface. Serve on injera with a mild cheese."]
},
{
  id:"bobotie", name:"Bobotie", country:"South Africa", flag:"🇿🇦", region:"Africa",
  wiki:"Bobotie", time:"1 h 20", diff:"Easy", serves:6, tags:["baked","comfort","sweet-savoury"],
  blurb:"Curried mince with dried fruit under a baked savoury custard.",
  history:"Bobotie is Cape Malay, from the community descended from people enslaved and exiled to the Cape from Indonesia, Malaysia and Bengal by the Dutch East India Company. Their cooking gave South Africa its curry-spiced, fruit-sweetened tradition. A version appears in a Dutch cookbook of 1609; the name likely relates to the Indonesian bobotok.",
  ing:[["ground beef","1 kg beef or lamb mince"],["onion","2 onions"],["bread","2 slices white bread"],["milk","400 ml milk"],["egg","3 eggs"],["curry powder","2 tbsp mild curry powder"],["turmeric","1 tsp turmeric"],["raisins","80 g raisins or sultanas"],["apricot jam","2 tbsp apricot jam or chutney"],["lemon","juice of ½ lemon"],["bay leaf","4 bay leaves"],["almonds","40 g flaked almonds"]],
  staples:["oil","salt","black pepper","vinegar"],
  steps:["Soak the bread in the milk; squeeze it out and keep the milk for the topping.","Fry the onions, add the curry powder and turmeric and cook 1 min, then brown the mince.","Stir in the soaked bread, raisins, jam, lemon juice, a splash of vinegar, salt and pepper. It should taste sweet, sour and spiced at once.","Press into a dish, smooth the top.","Beat the reserved milk with the eggs, pour over, and stand the bay leaves upright in the custard.","Bake 45 min at 180 °C until the top is set and golden. Serve with yellow rice and chutney."]
},
{
  id:"menemen", name:"Menemen", country:"Türkiye", flag:"🇹🇷", region:"Middle East & North Africa",
  wiki:"Menemen (food)", time:"20 min", diff:"Easy", serves:2, tags:["eggs","breakfast","vegetarian","quick","one-pan"],
  blurb:"Soft-scrambled eggs folded into peppers and tomato.",
  history:"Named after the town of Menemen near İzmir on Türkiye's Aegean coast, this is the cornerstone of the Turkish breakfast table, cooked in a small copper pan and eaten communally with bread. The national debate is whether onion belongs in it — Aegean purists say no. Its closest relative is shakshuka, though menemen's eggs are stirred, not poached.",
  ing:[["egg","4 eggs"],["tomato","3 ripe tomatoes, peeled and chopped"],["green pepper","3 Turkish sivri peppers or 1 green pepper"],["butter","2 tbsp butter"],["paprika","1 tsp pul biber (Aleppo pepper)"],["feta","crumbled beyaz peynir or feta (optional)"]],
  staples:["olive oil","salt","black pepper"],
  steps:["Fry the peppers gently in butter and oil until soft, 6 min.","Add the tomatoes and cook down until the water evaporates and it looks jammy, 8 min.","Beat the eggs lightly and pour in, then stir slowly over low heat.","Pull the pan off while the eggs are still glossy and barely set — menemen is never dry.","Scatter pul biber and cheese, and serve in the pan with plenty of bread."]
},
{
  id:"mercimek-corbasi", name:"Mercimek Çorbası", country:"Türkiye", flag:"🇹🇷", region:"Middle East & North Africa",
  wiki:"Lentil soup", time:"40 min", diff:"Easy", serves:4, tags:["soup","vegan","budget","comfort","one-pot"],
  blurb:"Velvety red lentil soup with mint butter and lemon.",
  history:"Red lentil soup is served in every Turkish lokanta, at every hour, and is the traditional first course of the iftar meal in Ramadan. Lentils were among the first crops domesticated in Anatolia and the Fertile Crescent, making this soup a direct descendant of some of the oldest cooking on earth. The dried-mint butter poured over at the end is not optional.",
  ing:[["red lentils","250 g red lentils"],["onion","1 onion"],["carrot","1 carrot"],["potato","1 small potato"],["tomato paste","1 tbsp tomato purée"],["butter","30 g butter"],["mint","1 tsp dried mint"],["paprika","1 tsp pul biber / paprika"],["lemon","lemon wedges"],["cumin","1 tsp cumin"]],
  staples:["olive oil","salt","black pepper","water"],
  steps:["Soften the chopped onion, carrot and potato in oil, 8 min. Stir in the tomato purée and cumin.","Add the rinsed lentils and 1.2 L water and simmer 25 min until everything is falling apart.","Blend completely smooth — this soup should have no texture at all. Loosen with water as needed and season.","Melt the butter and sizzle the dried mint and pul biber in it for 20 seconds.","Ladle the soup, swirl the red mint butter over, and serve with lemon to squeeze in."]
},
{
  id:"kabsa", name:"Kabsa", country:"Saudi Arabia", flag:"🇸🇦", region:"Middle East & North Africa",
  wiki:"Kabsa", time:"1 h 15", diff:"Medium", serves:6, tags:["rice","chicken","one-pot","celebration"],
  blurb:"Spiced rice cooked in chicken broth with dried lime and a warm spice blend.",
  history:"Kabsa is the everyday feast of the Arabian Peninsula, served on a communal platter and eaten with the right hand. Its spice profile — black lime (loomi), cardamom, cinnamon, cloves — records the Gulf's centuries of maritime trade with India and East Africa. Rice replaced wheat as the region's staple only after those trade links deepened.",
  ing:[["chicken thighs","1 whole chicken, jointed"],["rice","500 g basmati rice"],["onion","2 onions"],["carrot","1 carrot, grated"],["tomato","3 tomatoes, chopped"],["tomato paste","2 tbsp tomato purée"],["dried lime","2 dried limes (loomi), pierced"],["garlic","4 cloves garlic"],["cinnamon","1 cinnamon stick"],["cardamom","5 cardamom pods"],["cloves","4 cloves"],["bay leaf","2 bay leaves"],["raisins","raisins and toasted almonds to serve"]],
  staples:["oil","salt","black pepper","water"],
  steps:["Brown the chicken in oil, then set aside.","Fry the onion until golden, add garlic, whole spices, tomato and purée, and cook 5 min.","Return the chicken with the dried limes and 1.2 L water; simmer covered 35 min. Lift out the chicken.","Measure the broth, add the soaked rice, and cook covered on low 20 min until the liquid is gone.","Meanwhile grill or roast the chicken until the skin is crisp.","Mound the rice on a platter, lay the chicken on top, and scatter with fried raisins and almonds."]
},
{
  id:"baba-ganoush", name:"Baba Ganoush", country:"Levant", flag:"🇵🇸", region:"Middle East & North Africa",
  wiki:"Baba ghanoush", time:"40 min", diff:"Easy", serves:4, tags:["dip","vegan","smoky"],
  blurb:"Charred aubergine whipped with tahini and lemon.",
  history:"The name translates roughly as 'pampered father', and the dish belongs to the same Levantine mezze tradition as hummus. Everything depends on burning the aubergine skin black over an open flame; the smoke, not the flesh, is the flavour. In Lebanon the closely related moutabal is the tahini-rich version, while baba ganoush proper sometimes leans on chopped vegetables instead.",
  ing:[["eggplant","2 large aubergines"],["tahini","3 tbsp tahini"],["lemon","juice of 1 lemon"],["garlic","1 clove garlic"],["olive oil","3 tbsp olive oil"],["parsley","parsley to finish"],["pomegranate","pomegranate seeds (optional)"]],
  staples:["salt"],
  steps:["Char the whole aubergines directly on a gas flame, barbecue or under a fierce grill until the skin is black all over and they collapse, 20–25 min.","Rest them in a colander 15 min so the bitter juices drain away.","Scrape out the flesh — discard every scrap of skin — and chop it roughly rather than blending.","Beat in tahini, lemon, crushed garlic and salt with a fork to keep the texture.","Spread, pour over olive oil, and finish with parsley and pomegranate."]
},
{
  id:"maqluba", name:"Maqluba", country:"Palestine", flag:"🇵🇸", region:"Middle East & North Africa",
  wiki:"Maqluba", time:"1 h 30", diff:"Medium", serves:6, tags:["rice","one-pot","celebration"],
  blurb:"An upside-down pot of rice, fried aubergine and meat, flipped at the table.",
  history:"Maqluba means 'upside-down' in Arabic. A version appears in the 13th-century Kitab al-Tabikh, and it is now emblematic of Palestinian home cooking, particularly around Jerusalem and Nablus. The flip — pot inverted onto a tray in front of everyone — is the point of the dish as much as the eating.",
  ing:[["eggplant","2 aubergines, sliced and fried"],["rice","400 g short or medium-grain rice"],["chicken thighs","800 g chicken pieces (or lamb)"],["cauliflower","½ cauliflower, fried"],["onion","1 onion"],["cinnamon","1 tsp cinnamon"],["allspice","1 tsp allspice"],["turmeric","½ tsp turmeric"],["bay leaf","2 bay leaves"],["yogurt","yoghurt to serve"],["almonds","toasted almonds and pine nuts"]],
  staples:["oil","salt","black pepper","water"],
  steps:["Simmer the chicken with onion, bay and spices for 30 min; keep the broth and the meat separately.","Fry the aubergine and cauliflower until golden, then drain on paper.","In a heavy pot, layer: chicken at the bottom, then aubergine and cauliflower up the sides, then the soaked rice on top.","Pour over the hot spiced broth to about 2 cm above the rice. Cover and cook 30 min on low, then rest 15 min off the heat.","Loosen the edges, invert a wide tray over the pot, and flip in one confident movement. Lift the pot slowly.","Scatter with toasted nuts and serve with yoghurt and a chopped salad."]
},
{
  id:"omelette-fines-herbes", name:"Omelette aux Fines Herbes", country:"France", flag:"🇫🇷", region:"Europe",
  wiki:"Omelette", time:"8 min", diff:"Easy", serves:1, tags:["eggs","quick","budget","vegetarian"],
  blurb:"The three-egg test of a cook: pale, rolled, and soft in the middle.",
  history:"The French omelette is a technique more than a recipe, codified in the 19th century and used ever since to test cooks — Escoffier and later Julia Child both treated it as a measure of skill. The French version stays blond and rolls into a cigar; the American one browns and folds; the Spanish one is a cake. All three are eggs and heat.",
  ing:[["egg","3 eggs"],["butter","20 g butter"],["parsley","1 tbsp chopped parsley, chervil, chives and tarragon"]],
  staples:["salt","black pepper"],
  steps:["Beat the eggs just until uniform — no froth — and season.","Melt butter in a non-stick pan over medium heat until it foams but does not colour.","Pour in the eggs and stir constantly with a fork for 20 seconds, shaking the pan, until it looks like loose curds.","Stop stirring, let the base set for a few seconds, and scatter the herbs.","Tilt the pan and roll the omelette over on itself, then turn it out seam-side down. The centre should still be baveuse — slightly runny."]
},
{
  id:"caprese", name:"Insalata Caprese", country:"Italy", flag:"🇮🇹", region:"Europe",
  wiki:"Caprese salad", time:"5 min", diff:"Easy", serves:2, tags:["salad","no-cook","quick","vegetarian","summer"],
  blurb:"Tomato, mozzarella and basil — nothing else, nothing hidden.",
  history:"From the island of Capri, where it appeared in the early 20th century as a light antipasto; one account credits a patriotic mason who wanted a tricolour dish in the 1920s. Traditionally it uses mozzarella di bufala from Campania, and traditionally there is no balsamic vinegar anywhere near it.",
  ing:[["tomato","3 excellent ripe tomatoes"],["mozzarella","250 g buffalo mozzarella"],["basil","fresh basil leaves"],["olive oil","good extra virgin olive oil"],["oregano","a little dried oregano (optional)"]],
  staples:["salt","black pepper"],
  steps:["Slice tomatoes and mozzarella to the same thickness and lay them alternately on a plate.","Salt the tomato — this matters more than anything else here.","Tuck basil leaves between the slices, whole, never chopped.","Pour over olive oil, grind pepper, and serve at room temperature. Nothing is ever cooked or chilled."]
},
{
  id:"chicken-soup", name:"Chicken Noodle Soup", country:"Ashkenazi Jewish / Global", flag:"🌍", region:"Europe",
  wiki:"Chicken soup", time:"2 h", diff:"Easy", serves:6, tags:["soup","comfort","one-pot","budget"],
  blurb:"Golden broth, soft vegetables, noodles — the universal restorative.",
  history:"Ashkenazi Jewish tradition calls chicken soup 'Jewish penicillin', and the 12th-century physician Maimonides prescribed it for respiratory illness. Nearly every culture keeps a version — Greek avgolemono, Mexican caldo de pollo, Chinese ginger chicken broth. Modern studies suggest mild anti-inflammatory effects; the comfort was never in doubt.",
  ing:[["chicken","1 whole chicken or 1 kg wings and thighs"],["onion","2 onions"],["carrot","3 carrots"],["celery","3 celery sticks"],["garlic","4 cloves garlic"],["parsley","bunch parsley"],["bay leaf","2 bay leaves"],["noodles","150 g egg noodles"],["dill","dill to finish"]],
  staples:["salt","black pepper","water"],
  steps:["Cover the chicken with cold water, bring slowly to a bare simmer, and skim the grey foam carefully for the first 10 min.","Add the vegetables, herbs and peppercorns and simmer gently — never boil — for 1½ h.","Lift out the chicken, strip the meat, and strain the broth. Season now, generously.","Cook the noodles separately so they do not cloud the soup.","Combine broth, sliced carrot, chicken and noodles in the bowl and finish with dill."]
},
{
  id:"tuna-pasta", name:"Pasta al Tonno", country:"Italy", flag:"🇮🇹", region:"Europe",
  wiki:"Pasta", time:"20 min", diff:"Easy", serves:2, tags:["pasta","quick","budget","store-cupboard"],
  blurb:"Tinned tuna, garlic, chilli and tomato — dinner from the cupboard.",
  history:"Southern Italy's coastal towns preserved tuna in oil long before tins, and the store-cupboard pasta that resulted — a cousin of puttanesca and pasta con le sarde — is the definition of cucina povera: strong flavours from cheap, shelf-stable things. Italians do not put parmesan on it, since cheese and fish are not traditionally mixed.",
  ing:[["pasta","250 g spaghetti or penne"],["canned tuna","160 g tinned tuna in olive oil"],["garlic","3 cloves garlic"],["canned tomatoes","300 g tinned cherry tomatoes"],["capers","1 tbsp capers"],["olives","handful black olives"],["chili flakes","½ tsp chilli flakes"],["parsley","parsley"],["lemon","zest of ½ lemon"]],
  staples:["olive oil","salt","black pepper"],
  steps:["Start the pasta in salted boiling water.","Warm sliced garlic and chilli in olive oil until fragrant, not brown.","Add the tomatoes, capers and olives and simmer 8 min until saucy.","Flake in the tuna with its oil and warm through for 1 min only — longer and it goes dry and chalky.","Toss with the drained pasta and a splash of its water, then finish with parsley and lemon zest."]
},
{
  id:"congee", name:"Congee (Jook)", country:"China", flag:"🇨🇳", region:"East & Southeast Asia",
  wiki:"Congee", time:"1 h 15", diff:"Easy", serves:4, tags:["rice","breakfast","comfort","budget","one-pot"],
  blurb:"Rice simmered to a silky porridge, dressed with whatever you like.",
  history:"Congee is at least two thousand years old and is eaten from Guangzhou to Kerala to Manila, in health and especially in sickness — it is the food given to babies, invalids and the elderly across much of Asia. Its ratio of rice to water, roughly one to twelve, turns a handful of grains into a meal for a family, which is why it has always been famine food as well as breakfast.",
  ing:[["rice","150 g short-grain or jasmine rice"],["ginger","1 thumb ginger, sliced"],["stock","2 L chicken stock or water"],["chicken thighs","2 chicken thighs (optional)"],["spring onion","spring onions"],["soy sauce","soy sauce"],["sesame oil","sesame oil"],["peanuts","fried shallots or peanuts to top"],["egg","1 century egg or soft-boiled egg (optional)"]],
  staples:["salt","white pepper","oil"],
  steps:["Rinse the rice, then freeze it for an hour if you have time — the grains break down faster.","Bring rice, ginger and stock to a boil, then drop to the lowest simmer.","Cook 60–90 min, stirring occasionally so it does not catch, until the grains dissolve into cream.","Poach the chicken in the congee for the last 20 min and shred it.","Season with salt and white pepper and serve with soy, sesame oil, spring onion and something crunchy on top."]
},
{
  id:"pierogi", name:"Pierogi Ruskie", country:"Poland", flag:"🇵🇱", region:"Europe",
  wiki:"Pierogi", time:"1 h 30", diff:"Medium", serves:4, tags:["dumplings","comfort","vegetarian","budget"],
  blurb:"Dumplings filled with potato and curd cheese, served under fried onions.",
  history:"Pierogi are recorded in Poland from the 13th century and may have arrived along trade and monastic routes from further east. 'Ruskie' does not mean Russian — it refers to Red Ruthenia, a historic region now split between Poland and Ukraine. They are Christmas Eve food, wedding food and everyday food at once.",
  ing:[["flour","500 g plain flour"],["egg","1 egg"],["potato","600 g potatoes"],["cottage cheese","250 g twaróg / curd or ricotta"],["onion","3 onions"],["butter","60 g butter"],["sour cream","soured cream to serve"]],
  staples:["salt","black pepper","water","oil"],
  steps:["Make a soft dough with flour, egg, a pinch of salt and 250 ml warm water. Knead 8 min and rest, covered, 30 min.","Boil and mash the potatoes; mix with the curd cheese and one onion fried until golden. Season hard — the filling must be bolder than you think.","Roll the dough thin, cut discs, fill each and pinch the edges tightly shut.","Boil in batches in salted water; they are done about 2 min after they float.","Fry the remaining onions in butter until sweet and brown and pour over the drained pierogi. Serve with soured cream."]
},
{
  id:"lentil-bolognese", name:"Lentil Ragù", country:"Italy (modern)", flag:"🇮🇹", region:"Europe",
  wiki:"Lentil", time:"50 min", diff:"Easy", serves:4, tags:["vegan","pasta","budget","one-pot"],
  blurb:"A meatless ragù with the same slow-built depth.",
  history:"Meatless ragùs are not a modern marketing idea in Italy — Catholic fasting days, and simple poverty, produced vegetable and legume sauces for centuries, and lentils have long carried a New Year's association with coins and prosperity. The contemporary version leans on umami sources like mushrooms and tomato purée to replace what the meat was doing.",
  ing:[["lentils","250 g brown or puy lentils"],["onion","1 onion"],["carrot","2 carrots"],["celery","2 celery sticks"],["mushrooms","200 g mushrooms, finely chopped"],["canned tomatoes","400 g tinned tomatoes"],["tomato paste","2 tbsp tomato purée"],["red wine","150 ml red wine"],["garlic","3 cloves garlic"],["thyme","thyme and a bay leaf"],["pasta","pasta to serve"]],
  staples:["olive oil","salt","black pepper","water"],
  steps:["Chop onion, carrot and celery finely and sweat in olive oil 10 min.","Add the mushrooms and cook until all their water has gone and they start to brown — this is where the depth comes from.","Stir in garlic and tomato purée, cook 2 min, then deglaze with wine.","Add lentils, tomatoes and herbs with 400 ml water and simmer 30–35 min until thick and the lentils are tender.","Season well and toss with pasta, or use it in a lasagne."]
}
];
