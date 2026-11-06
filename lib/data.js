const W = "Apple,Ball,Cat,Dog,Egg,Fish,Goat,Hat,Insect,Juice,Kite,Lion,Moon,Nose,Orange,Pen,Queen,Rabbit,Sun,Tree,Umbrella,Van,Water,Box,Yacht,Zebra".split(",");
const E = "🍎,⚽,🐱,🐶,🥚,🐟,🐐,🎩,🐛,🧃,🪁,🦁,🌙,👃,🍊,🖊️,👸,🐰,☀️,🌳,☂️,🚐,💧,📦,⛵,🦓".split(",");
const U = "Olma,To'p,Mushuk,It,Tuxum,Baliq,Echki,Shlyapa,Hasharot,Sharbat,Varrak,Sher,Oy,Burun,Apelsin,Ruchka,Malika,Quyon,Quyosh,Daraxt,Soyabon,Furgon,Suv,Quti,Yaxta,Zebra".split(",");
const mk = (s) => s.split(";").map((x) => { const [en, e, uz] = x.split("|"); return { en, e, uz }; });

const nums = "One|1|Bir;Two|2|Ikki;Three|3|Uch;Four|4|To'rt;Five|5|Besh;Six|6|Olti;Seven|7|Yetti;Eight|8|Sakkiz;Nine|9|To'qqiz;Ten|10|O'n"
  .split(";").map((x) => { const [en, big, uz] = x.split("|"); return { en, big, e: big, uz }; });
const days = "Monday|Dushanba;Tuesday|Seshanba;Wednesday|Chorshanba;Thursday|Payshanba;Friday|Juma;Saturday|Shanba;Sunday|Yakshanba"
  .split(";").map((x) => { const [en, uz] = x.split("|"); return { en, big: en.slice(0, 3), e: "📅", uz }; });

export const CATS = [
  { id: "numbers", title: "Raqamlar", icon: "🔢", color: "#ffd166", items: nums },
  { id: "letters", title: "Harflar", icon: "🔤", color: "#ff9aa2", items: W.map((en, i) => ({ en, e: E[i], uz: U[i], tag: en[0] + " " + en[0].toLowerCase() })) },
  { id: "animals", title: "Hayvonlar", icon: "🐶", color: "#9be564", items: mk("Cat|🐱|Mushuk;Dog|🐶|It;Cow|🐮|Sigir;Horse|🐴|Ot;Sheep|🐑|Qo'y;Duck|🦆|O'rdak;Chicken|🐔|Tovuq;Rabbit|🐰|Quyon;Bird|🐦|Qush;Fish|🐟|Baliq;Lion|🦁|Sher;Elephant|🐘|Fil;Monkey|🐵|Maymun;Bear|🐻|Ayiq") },
  { id: "home", title: "Uy jihozlari", icon: "🛋️", color: "#a0c4ff", items: mk("Chair|🪑|Stul;Bed|🛏️|Karavot;Door|🚪|Eshik;Window|🪟|Deraza;Lamp|💡|Chiroq;Sofa|🛋️|Divan;TV|📺|Televizor;Clock|🕒|Soat;Cup|☕|Piyola;Spoon|🥄|Qoshiq;Plate|🍽️|Likopcha;Mirror|🪞|Oyna;Key|🔑|Kalit") },
  { id: "people", title: "Shaxslar", icon: "🧑‍🏫", color: "#caffbf", items: mk("Boy|👦|O'g'il bola;Girl|👧|Qiz bola;Man|👨|Erkak;Woman|👩|Ayol;Baby|👶|Chaqaloq;Teacher|🧑‍🏫|O'qituvchi;Doctor|🧑‍⚕️|Shifokor;Police|👮|Politsiyachi;Cook|🧑‍🍳|Oshpaz;Farmer|🧑‍🌾|Dehqon;Pilot|🧑‍✈️|Uchuvchi") },
  { id: "family", title: "Oila a'zolari", icon: "👨‍👩‍👧‍👦", color: "#ffc6ff", items: mk("Mother|👩|Ona;Father|👨|Ota;Brother|👦|Aka-uka;Sister|👧|Opa-singil;Grandma|👵|Buvi;Grandpa|👴|Bobo;Baby|👶|Chaqaloq;Family|👨‍👩‍👧‍👦|Oila;Uncle|🧔|Amaki;Aunt|👩‍🦰|Xola") },
  { id: "school", title: "Maktab jihozlari", icon: "🎒", color: "#fdffb6", items: mk("Book|📚|Kitob;Pen|🖊️|Ruchka;Pencil|✏️|Qalam;Bag|🎒|Sumka;Ruler|📏|Chizg'ich;Eraser|🧽|O'chirg'ich;Scissors|✂️|Qaychi;Glue|🧴|Yelim;Notebook|📓|Daftar;Paint|🎨|Bo'yoq") },
  { id: "talk", title: "Salomlashish", icon: "👋", color: "#bdb2ff", items: mk("Hello|👋|Salom;Goodbye|🙋|Xayr;Good morning|🌅|Xayrli tong;Good night|🌙|Xayrli tun;Thank you|🙏|Rahmat;Please|🥺|Iltimos;Sorry|😔|Kechirasiz;Yes|✅|Ha;No|❌|Yo'q;Welcome|🤗|Xush kelibsiz") },
  { id: "colors", title: "Ranglar", icon: "🌈", color: "#ffadad", items: mk("Red|🔴|Qizil;Blue|🔵|Ko'k;Green|🟢|Yashil;Yellow|🟡|Sariq;Orange|🟠|To'q sariq;Purple|🟣|Binafsha;Black|⚫|Qora;White|⚪|Oq;Brown|🟤|Jigarrang;Pink|🩷|Pushti") },
  { id: "days", title: "Hafta kunlari", icon: "📅", color: "#9bf6ff", items: days },
  { id: "toys", title: "O'yinchoqlar", icon: "🧸", color: "#ffd6a5", items: mk("Ball|⚽|To'p;Doll|🪆|Qo'g'irchoq;Car|🚗|Mashina;Teddy bear|🧸|Ayiqcha;Kite|🪁|Varrak;Robot|🤖|Robot;Train|🚂|Poyezd;Blocks|🧱|Kubiklar;Puzzle|🧩|Boshqotirma;Drum|🥁|Nog'ora") },
];

export const STICKERS = [
  { id: "🦄", cost: 20 }, { id: "🚀", cost: 40 }, { id: "🐉", cost: 60 },
  { id: "🌈", cost: 80 }, { id: "👑", cost: 100 }, { id: "🏆", cost: 150 },
];
