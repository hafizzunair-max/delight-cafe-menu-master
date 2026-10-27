import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Search, House, BookOpen, Brain, Bookmark, RotateCcw, CheckCircle2,
  CircleHelp, ChevronRight, Sparkles, Utensils, SlidersHorizontal,
  CircleDollarSign, Leaf, Clock3, Menu as MenuIcon, X, Download, Trophy,
  ArrowRight, Info, ShieldCheck, Zap
} from "lucide-react";
import "./styles.css";

const menuItems = [
  // Prices transcribed from the latest uploaded menu image. Values needing confirmation are explicitly marked.
  {id:"burger-zingratoo",name:"Zingratoo Burger",category:"Burgers",price:"Rs 510",ingredients:["Burger bun","Crispy chicken patty (visual estimate)","Lettuce/salad (visual estimate)"],status:"partial",note:"Exact sauces, cheese and patty recipe need confirmation from the café kitchen."},
  {id:"burger-grill",name:"Grill Burger",category:"Burgers",price:"Rs 570",ingredients:["Burger bun","Grilled patty (type unconfirmed)","Cheese/salad (visual estimate)"],status:"partial",note:"Confirm whether the patty is chicken or beef and check the exact sauce."},
  {id:"burger-spice",name:"Spice Burger",category:"Burgers",price:"Rs 340",ingredients:["Burger bun","Patty (type unconfirmed)","Salad (visual estimate)"],status:"partial",note:"Exact ingredients are not readable from the image."},
  {id:"burger-reggy",name:"Reggy Burger",category:"Burgers",price:"Rs 390",ingredients:["Burger bun","Patty (type unconfirmed)","Salad (visual estimate)"],status:"partial",note:"Exact ingredients are not readable from the image."},
  {id:"burger-special",name:"Special Burger",category:"Burgers",price:"Rs 790",ingredients:["Burger bun","Multiple visible fillings (exact contents unconfirmed)"],status:"partial",note:"Confirm patty count, sauces, cheese and salad with the kitchen."},

  {id:"flaming-wings",name:"Flaming Wings",category:"Crispy & Chicken",price:"6 pcs Rs 450 · 12 pcs Rs 790",ingredients:["Chicken wings","Flaming/spicy-style seasoning (name-based)"],status:"partial",note:"Exact marinade and dip are not confirmed."},
  {id:"peri-peri-wings",name:"Peri Peri Wings",category:"Crispy & Chicken",price:"6 pcs Rs 410 · 12 pcs Rs 710",ingredients:["Chicken wings","Peri-peri seasoning (name-based)"],status:"partial",note:"Exact marinade and dip are not confirmed."},
  {id:"hot-wings",name:"Hot Wings",category:"Crispy & Chicken",price:"5 pcs Rs 370 · 10 pcs Rs 630",ingredients:["Chicken wings","Spicy coating/seasoning (name-based)"],status:"check",note:"Quantity and price labels are small in the image; verify against the counter menu."},
  {id:"fried-chicken",name:"Fried Chicken",category:"Crispy & Chicken",price:"1 pc Rs 270 · 3 pcs Rs 730 · 5 pcs Rs 1130",ingredients:["Chicken pieces","Fried coating (name-based)"],status:"check",note:"The small quantity/price text should be checked against the current menu."},
  {id:"injected-nuggets",name:"Injected Nuggets",category:"Crispy & Chicken",price:"9 pcs Rs 470",ingredients:["Nuggets (exact recipe unconfirmed)"],status:"check",note:"Quantity/price and recipe need confirmation."},
  {id:"hotshots",name:"Hotshots",category:"Crispy & Chicken",price:"10 pcs Rs 350 · 20 pcs Rs 730",ingredients:["Small crispy chicken bites (visual/name-based)"],status:"partial",note:"Confirm exact recipe and price with the café."},

  {id:"royal-kabab",name:"Royal Kabab Crust",category:"Pizzas",price:"Image text unclear — verify",ingredients:["Kabab-style crust (name-based)"],status:"check",note:"The size/price labels in the image are not reliably readable. Do not quote them without checking."},
  {id:"afghani-malai",name:"Afghani Malaibooti",category:"Pizzas",price:"Image text unclear — verify",ingredients:["Afghani malai boti-style topping (name-based)"],status:"check",note:"The size/price labels and full ingredient list need confirmation."},
  {id:"super-delight",name:"Super Delight Pizza",category:"Pizzas",price:"Image text unclear — verify",ingredients:["Pizza base and toppings (exact list unconfirmed)"],status:"check",note:"Exact size prices and ingredients are not reliably readable."},
  {id:"behari-kabab",name:"Behari Kabab Pizza",category:"Pizzas",price:"Image text unclear — verify",ingredients:["Behari-style kabab topping (name-based)"],status:"check",note:"Exact size prices and full toppings need confirmation."},
  {id:"crown-crust",name:"Crown Crust",category:"Pizzas",price:"Image text unclear — verify",ingredients:["Special/stuffed crust (name-based)"],status:"check",note:"Exact size prices and fillings need confirmation."},
  {id:"grilled-bite",name:"Grilled Bite Pizza",category:"Pizzas",price:"Image text unclear — verify",ingredients:["Grilled-style topping (name-based)"],status:"check",note:"Exact size prices and ingredients need confirmation."},
  {id:"chicken-tikka",name:"Chicken Tikka",category:"Local Treats Pizzas",price:"Small Rs 650 · Medium Rs 1230 · Large Rs 1650 · Party Rs 2450",ingredients:["Tandoori chicken (as partly readable)","Red onion (as partly readable)","Chilli sauce (as partly readable)"],status:"partial",note:"Some menu description text is blurred. Confirm full recipe."},
  {id:"chicken-fajita",name:"Chicken Fajita",category:"Local Treats Pizzas",price:"Small Rs 650 · Medium Rs 1230 · Large Rs 1650 · Party Rs 2450",ingredients:["Fajita-style chicken (name-based)","Other toppings unconfirmed"],status:"partial",note:"Full ingredient text is not reliably readable."},
  {id:"chicken-supreme",name:"Chicken Supreme",category:"Local Treats Pizzas",price:"Small Rs 650 · Medium Rs 1230 · Large Rs 1650 · Party Rs 2450",ingredients:["Chicken topping","Sauce/cheese (typical, not verified)"],status:"partial",note:"Treat this as an unverified summary; confirm actual recipe."},
  {id:"chicken-tandoori",name:"Chicken Tandoori",category:"Local Treats Pizzas",price:"Small Rs 650 · Medium Rs 1230 · Large Rs 1650 · Party Rs 2450",ingredients:["Tandoori-style chicken (name-based)","Other toppings unconfirmed"],status:"partial",note:"Full recipe needs confirmation."},
  {id:"chicken-lovers",name:"Chicken Lovers",category:"Local Treats Pizzas",price:"Small Rs 650 · Medium Rs 1230 · Large Rs 1650 · Party Rs 2450",ingredients:["Chicken-focused topping (name-based)"],status:"partial",note:"Exact chicken types, sauces and vegetables are unconfirmed."},
  {id:"cheese-lovers",name:"Cheese Lovers",category:"Local Treats Pizzas",price:"Small Rs 650 · Medium Rs 1230 · Large Rs 1650 · Party Rs 2450",ingredients:["Cheese-focused topping (name-based)"],status:"partial",note:"Exact cheeses and other toppings need confirmation."},
  {id:"veggi-lovers",name:"Veggi Lovers",category:"Local Treats Pizzas",price:"Small Rs 650 · Medium Rs 1230 · Large Rs 1650 · Party Rs 2450",ingredients:["Vegetable toppings (name-based)","Cheese (unconfirmed)"],status:"partial",note:"Exact vegetable list needs confirmation."},
  {id:"hot-spicy",name:"Hot & Spicy",category:"Local Treats Pizzas",price:"Small Rs 650 · Medium Rs 1230 · Large Rs 1650 · Party Rs 2450",ingredients:["Spicy-style topping (name-based)"],status:"partial",note:"Exact ingredients and spice level need confirmation."},
  {id:"extra-toppings",name:"Extra Toppings",category:"Pizzas",price:"Small Rs 120 · Medium Rs 130 · Large Rs 210 · Party Rs 720",ingredients:["Optional pizza toppings"],status:"check",note:"Confirm these values: image text is small, especially Party price."},
  {id:"stuffed-calzone",name:"Stuffed Calzone",category:"Pizza Sides",price:"Image text unclear — verify",ingredients:["Stuffed baked pizza-style item (name-based)"],status:"check",note:"Exact filling and price need confirmation."},
  {id:"cheesy-sticks",name:"Cheesy Sticks",category:"Pizza Sides",price:"Rs 590 (appears in image)",ingredients:["Bread/stick base","Cheese (name-based)"],status:"partial",note:"Price and full recipe should be confirmed."},
  {id:"special-platter",name:"Special Platter",category:"Pizza Sides",price:"Image text unclear — verify",ingredients:["Mixed platter (contents unconfirmed)"],status:"check",note:"Confirm items included and price."},
  {id:"pizza-stacker",name:"Pizza Stacker",category:"Pizza Sides",price:"Rs 500 (appears in image)",ingredients:["Stacked pizza-style item (name-based)"],status:"partial",note:"Exact filling and price should be confirmed."},

  {id:"behari-roll",name:"Behari Roll",category:"Rolls & Wraps",price:"Rs 650",ingredients:["Behari-style filling (name-based)","Roll/paratha (unconfirmed)"],status:"partial",note:"Confirm filling and bread type with kitchen."},
  {id:"fried-chicken-wrap",name:"Fried Chicken Wrap",category:"Rolls & Wraps",price:"Rs 600",ingredients:["Fried chicken (name-based)","Wrap bread (name-based)"],status:"partial",note:"Sauces and vegetables are not confirmed."},
  {id:"grilled-wrap",name:"Grilled Wrap",category:"Rolls & Wraps",price:"Rs 650",ingredients:["Grilled filling (type unconfirmed)","Wrap bread"],status:"partial",note:"Confirm protein type and sauce."},

  {id:"bbq-pasta",name:"B.B.Q Pasta",category:"Pastas",price:"Image text unclear — verify",ingredients:["Pasta","BBQ sauce/flavour (partly readable)","Cheese blend (partly readable)"],status:"partial",note:"Half/full prices are not reliably readable in the latest image."},
  {id:"chicken-pasta",name:"Chicken Pasta",category:"Pastas",price:"Image text unclear — verify",ingredients:["Pasta","Chicken (name-based)","Sauce (unconfirmed)"],status:"partial",note:"Half/full prices and exact sauce need confirmation."},
  {id:"special-creamy-pasta",name:"Special Creamy Pasta",category:"Pastas",price:"Half Rs 550 · Full Rs 1050 (verify)",ingredients:["Pasta","Creamy sauce (name-based)"],status:"partial",note:"Check the half/full prices and exact toppings at the counter."},

  {id:"french-fries",name:"French Fries",category:"Fries",price:"Medium Rs 210 · Large Rs 330 · Family Rs 600",ingredients:["Potatoes","Frying oil","Seasoning (optional; exact recipe unconfirmed)"],status:"partial",note:"Prices are transcribed from the latest image; confirm current rates."},
  {id:"loaded-fries",name:"Loaded Fries",category:"Fries",price:"Large Rs 630 (other size unclear)",ingredients:["Fries","Cheese sauce/toppings (partly readable)"],status:"partial",note:"Exact toppings and other size prices are not clear."},

  {id:"club-sandwich",name:"Club Sandwich",category:"Sandwiches",price:"Rs 650",ingredients:["Sandwich bread","Filling not confirmed"],status:"check",note:"Ask the kitchen for the exact filling list."},
  {id:"super-sandwich",name:"Super Sandwich",category:"Sandwiches",price:"Rs 650",ingredients:["Sandwich bread","Filling not confirmed"],status:"check",note:"Ask the kitchen for the exact filling list."},
  {id:"grill-sandwich",name:"Grill Sandwich",category:"Sandwiches",price:"Rs 650",ingredients:["Sandwich bread","Grilled filling not confirmed"],status:"check",note:"Ask the kitchen for the exact filling list."},
  {id:"maxican-sandwich",name:"Maxican Sandwich",category:"Sandwiches",price:"Rs 500",ingredients:["Sandwich bread","Mexican-style filling (name-based)"],status:"check",note:"Spelling and exact filling should be confirmed."},

  {id:"mint-margarita",name:"Mint Margarita",category:"Drinks",price:"Rs 250",ingredients:["Mint flavour","Lemon/lime flavour (typical; recipe unconfirmed)"],status:"partial",note:"Exact recipe and ingredients need confirmation."},
  {id:"drink-15l",name:"1.5 Ltr Drink",category:"Drinks",price:"Rs 220",ingredients:["Bottled soft drink"],status:"partial",note:"Brand/flavour depends on café stock."},
  {id:"drink-500",name:"500 ml Drink",category:"Drinks",price:"Rs 120",ingredients:["Bottled soft drink"],status:"partial",note:"Brand/flavour depends on café stock."},
  {id:"regular-drink",name:"Regular Drink",category:"Drinks",price:"Rs 90",ingredients:["Soft drink"],status:"partial",note:"Size and brand should be confirmed."},
  {id:"small-water",name:"Small Water",category:"Drinks",price:"Rs 60",ingredients:["Bottled water"],status:"partial",note:"Confirm bottle size/brand if customer asks."},

  {id:"deal-1",name:"Deal 1",category:"Deals",price:"Rs 750",ingredients:["Zinger Burger","Regular Fries","Regular Drink"],status:"partial",note:"Image says Zinger Burger; confirm if this is the same as the Zingratoo Burger."},
  {id:"deal-2",name:"Deal 2",category:"Deals",price:"Rs 640",ingredients:["Reggy Burger","Regular Fries","Regular Drink"],status:"partial",note:"Deal contents transcribed from image."},
  {id:"deal-3",name:"Deal 3",category:"Deals",price:"Rs 2650",ingredients:["5 Zinger Burgers","1.5 Ltr Drink"],status:"partial",note:"Confirm current price."},
  {id:"deal-4",name:"Deal 4",category:"Deals",price:"Rs 3150",ingredients:["Party Pizza","10 Hot Wings","1.5 Ltr Drink"],status:"partial",note:"Confirm current price."},
  {id:"deal-5",name:"Deal 5",category:"Deals",price:"Rs 2900",ingredients:["1 Large Pizza","1 Platter","1.5 Ltr Drink"],status:"partial",note:"Confirm what the platter contains."},
  {id:"friends-deal",name:"Friends Deal",category:"Deals",price:"Rs 1950",ingredients:["1 Medium Pizza","10 Hot Wings","1.5 Ltr Drink"],status:"partial",note:"Confirm current price."},
  {id:"hot-deal",name:"Hot Deal",category:"Deals",price:"Rs 2300",ingredients:["1 Large Pizza","10 Hot Shots","Regular Fries","1.5 Ltr Drink"],status:"partial",note:"Confirm current price and whether item is Hotshots."},
  {id:"family-fun",name:"Family Fun Deal",category:"Deals",price:"Rs 3400",ingredients:["2 Large Pizzas","1.5 Ltr Drink"],status:"partial",note:"Confirm current price."},
  {id:"family-party",name:"Family Party Deal",category:"Deals",price:"Rs 5150",ingredients:["2 Large Pizzas","10 Hot Wings","10 Nuggets","Family Fries","1.5 Ltr Drink"],status:"partial",note:"Confirm current price."}
];

const categories = ["All", ...new Set(menuItems.map(item => item.category))];
const categoryEmoji = {"Burgers":"🍔","Crispy & Chicken":"🍗","Pizzas":"🍕","Local Treats Pizzas":"🍕","Pizza Sides":"🧀","Rolls & Wraps":"🌯","Pastas":"🍝","Fries":"🍟","Sandwiches":"🥪","Drinks":"🥤","Deals":"🎁"};
const starterQuestions = [
  {q:"Zingratoo Burger ki listed price kya hai?", options:["Rs 510","Rs 570","Rs 340","Rs 790"], answer:"Rs 510", why:"Latest uploaded image mein Zingratoo ke neeche Rs 510 likha hai."},
  {q:"Reggy Burger ki listed price kya hai?", options:["Rs 340","Rs 390","Rs 510","Rs 650"], answer:"Rs 390", why:"Reggy Burger ki image ke neeche Rs 390 nazar aata hai."},
  {q:"Deal 1 mein kya shamil hai?", options:["2 Large Pizzas","Zinger Burger + Regular Fries + Regular Drink","5 Zinger Burgers","1 Medium Pizza + 10 Hot Wings"], answer:"Zinger Burger + Regular Fries + Regular Drink", why:"Deal 1 ke box mein ye 3 items listed hain."},
  {q:"Peri Peri Wings ke 6 pieces ki listed price?", options:["Rs 450","Rs 410","Rs 370","Rs 470"], answer:"Rs 410", why:"Latest image mein 6 pcs ke liye Rs 410 nazar aata hai."},
  {q:"Mint Margarita ki listed price?", options:["Rs 220","Rs 120","Rs 250","Rs 90"], answer:"Rs 250", why:"Drinks section mein Mint Margarita Rs 250 hai."},
  {q:"Family Party Deal mein kya listed hai?", options:["2 Large Pizzas + 1.5 L drink only","2 Large Pizzas, 10 Hot Wings, 10 Nuggets, Family Fries, 1.5 L drink","1 Party Pizza + 10 wings","5 Zinger Burgers"], answer:"2 Large Pizzas, 10 Hot Wings, 10 Nuggets, Family Fries, 1.5 L drink", why:"Ye items Family Party Deal ke box mein listed hain."},
  {q:"French Fries ke Family size ki listed price?", options:["Rs 330","Rs 450","Rs 600","Rs 630"], answer:"Rs 600", why:"Latest uploaded image mein French Fries Family price Rs 600 hai."},
  {q:"Grilled Wrap ki latest image wali price?", options:["Rs 600","Rs 650","Rs 550","Rs 700"], answer:"Rs 650", why:"Latest image mein Grilled Wrap ke saamne Rs 650 likha hai."},
  {q:"Local Treats pizzas ke Small size ki listed price?", options:["Rs 590","Rs 650","Rs 720","Rs 1230"], answer:"Rs 650", why:"Local Treats section ke neeche Small Rs 650 likha hai."},
  {q:"Kaunsi information kitchen se confirm karni chahiye?", options:["Sirf item ka naam","Blurred/uncertain ingredients and prices","Kuch bhi nahi","Har listed category"], answer:"Blurred/uncertain ingredients and prices", why:"App uncertain information ko verified fact ke taur par present nahi karti."}
];

function App() {
  const [page, setPage] = useState("home");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem("dcm-saved") || "[]"));
  const [known, setKnown] = useState(() => JSON.parse(localStorage.getItem("dcm-known") || "[]"));
  const [scores, setScores] = useState(() => JSON.parse(localStorage.getItem("dcm-scores") || '{"done":0,"correct":0}'));
  const [quizIndex, setQuizIndex] = useState(0);
  const [chosen, setChosen] = useState("");
  const [checkedAnswer, setCheckedAnswer] = useState(false);
  const [quizOrder, setQuizOrder] = useState(() => [...starterQuestions].sort(() => Math.random() - 0.5));
  const [mobileNav, setMobileNav] = useState(false);
  const [adminEdit, setAdminEdit] = useState(false);
  const [draftPrice, setDraftPrice] = useState("");
  const [draftIngredients, setDraftIngredients] = useState("");
  const [customData, setCustomData] = useState(() => JSON.parse(localStorage.getItem("dcm-custom") || "{}"));
  const [toast, setToast] = useState("");

  useEffect(() => { localStorage.setItem("dcm-saved", JSON.stringify(saved)); }, [saved]);
  useEffect(() => { localStorage.setItem("dcm-known", JSON.stringify(known)); }, [known]);
  useEffect(() => { localStorage.setItem("dcm-scores", JSON.stringify(scores)); }, [scores]);
  useEffect(() => { localStorage.setItem("dcm-custom", JSON.stringify(customData)); }, [customData]);
  useEffect(() => {
    if ("serviceWorker" in navigator && import.meta.env.PROD) navigator.serviceWorker.register("./sw.js").catch(() => {});
  }, []);

  const mergedItems = useMemo(() => menuItems.map(item => ({...item, ...(customData[item.id] || {})})), [customData]);
  const filtered = useMemo(() => mergedItems.filter(item =>
    (category === "All" || item.category === category) &&
    (page !== "saved" || saved.includes(item.id)) &&
    `${item.name} ${item.category} ${item.ingredients.join(" ")}`.toLowerCase().includes(query.toLowerCase())
  ), [mergedItems, category, query, page, saved]);
  const activeQuiz = quizOrder[quizIndex % quizOrder.length];

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }
  function openItem(item) {
    setSelected(item);
    setDraftPrice(item.price);
    setDraftIngredients(item.ingredients.join("\n"));
    setAdminEdit(false);
  }
  function toggleSaved(id) {
    setSaved(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);
  }
  function checkAnswer() {
    if (!chosen) return;
    setCheckedAnswer(true);
    const correct = chosen === activeQuiz.answer;
    setScores(old => ({done: old.done + 1, correct: old.correct + (correct ? 1 : 0)}));
  }
  function nextQuestion() {
    setQuizIndex(i => (i + 1) % quizOrder.length);
    setChosen("");
    setCheckedAnswer(false);
  }
  function resetQuiz() {
    setQuizOrder([...starterQuestions].sort(() => Math.random() - 0.5));
    setQuizIndex(0); setChosen(""); setCheckedAnswer(false);
    notify("Quiz dobara shuru ho gaya");
  }
  function saveCustom() {
    setCustomData(old => ({...old, [selected.id]: {
      price: draftPrice.trim() || selected.price,
      ingredients: draftIngredients.split("\n").map(s => s.trim()).filter(Boolean),
      status: "user-edited",
      note: "User-entered information. Please verify with café's current menu/recipe."
    }}));
    setSelected({...selected, price:draftPrice.trim() || selected.price, ingredients:draftIngredients.split("\n").map(s=>s.trim()).filter(Boolean), status:"user-edited", note:"User-entered information. Please verify with café's current menu/recipe."});
    setAdminEdit(false);
    notify("Local device par update save ho gaya");
  }
  function exportBackup() {
    const data = {saved, known, scores, customData, exportedAt:new Date().toISOString()};
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="delight-menu-master-backup.json"; a.click();
    URL.revokeObjectURL(url);
  }
  function importBackup(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.saved) setSaved(data.saved);
        if (data.known) setKnown(data.known);
        if (data.scores) setScores(data.scores);
        if (data.customData) setCustomData(data.customData);
        notify("Backup restore ho gaya");
      } catch { notify("Backup file valid JSON nahi hai"); }
    };
    reader.readAsText(file);
    event.target.value = "";
  }
  function markKnown(id) {
    setKnown(old => old.includes(id) ? old.filter(x=>x!==id) : [...old,id]);
  }

  const nav = [
    {id:"home",label:"Overview",icon:House},
    {id:"menu",label:"Explore menu",icon:Utensils},
    {id:"quiz",label:"Smart quiz",icon:Brain},
    {id:"saved",label:"Saved items",icon:Bookmark},
    {id:"progress",label:"My progress",icon:Trophy}
  ];
  const pageTitle = ({home:"Your café, memorised.",menu:"Explore the menu.",quiz:"Train your menu memory.",saved:"Your saved menu.",progress:"Your learning progress."})[page] || "Menu Master";

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
      <div className="brand">
        <div className="brand-mark"><Utensils size={23}/></div>
        <div><b>DELIGHT <span>CAFÉ</span></b><small>MENU MASTER</small></div>
        <button className="icon-btn mobile-close" onClick={()=>setMobileNav(false)} aria-label="Close menu"><X/></button>
      </div>
      <div className="side-label">WORKSPACE</div>
      <nav>{nav.map(({id,label,icon:Icon})=><button key={id} className={`nav-link ${page===id?"active":""}`} onClick={()=>{setPage(id);setCategory("All");setQuery("");setMobileNav(false);}}><Icon size={18}/><span>{label}</span>{id==="saved"&&saved.length>0&&<em>{saved.length}</em>}</button>)}</nav>
      <div className="sidebar-bottom">
        <div className="offline-pill"><span className="pulse-dot"></span> Local-first learning</div>
        <div className="side-tip"><Sparkles size={16}/><p>Little practice every day. Confident service every shift.</p></div>
        <div className="profile"><div className="avatar">DC</div><div><b>Delight Café</b><small>Personal learner mode</small></div></div>
      </div>
    </aside>
    {mobileNav && <button className="scrim" aria-label="Close navigation" onClick={()=>setMobileNav(false)} />}
    <main className="main-content">
      <header className="topbar">
        <button className="icon-btn menu-toggle" onClick={()=>setMobileNav(true)} aria-label="Open menu"><MenuIcon/></button>
        <div className="breadcrumb">Workspace <ChevronRight size={14}/> <b>{nav.find(n=>n.id===page)?.label || "Menu Master"}</b></div>
        <div className="top-actions"><span className="live-badge"><span></span> Ready to learn</span><button className="icon-btn" title="Export backup" onClick={exportBackup}><Download size={18}/></button></div>
      </header>

      {page==="home" && <section className="page-wrap">
        <div className="hero-card">
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={14}/> YOUR PERSONAL MENU COACH</div>
            <h1>Know the menu.<br/><span>Own the moment.</span></h1>
            <p>Prices, ingredients and combos — learn them in small steps, then practise like you're on shift.</p>
            <div className="hero-actions"><button className="btn-primary" onClick={()=>setPage("quiz")}>Start a quick quiz <ArrowRight size={17}/></button><button className="btn-ghost-light" onClick={()=>setPage("menu")}>Browse menu</button></div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
            <div className="floating-card float-pizza"><span>🍕</span><small>Fresh picks</small></div>
            <div className="food-orb">🍔</div>
            <div className="floating-card float-score"><Trophy size={16}/><div><b>{scores.correct}/{scores.done}</b><small>Quiz correct</small></div></div>
            <div className="spark spark-a">✦</div><div className="spark spark-b">✧</div>
          </div>
          <div className="hero-glow"></div>
        </div>

        <div className="stats-grid">
          <div className="stat-card"><div className="stat-icon mint"><BookOpen/></div><div><small>Menu items</small><strong>{mergedItems.length}</strong><span>Across all categories</span></div></div>
          <div className="stat-card"><div className="stat-icon orange"><Bookmark/></div><div><small>Saved items</small><strong>{saved.length}</strong><span>Quick revision list</span></div></div>
          <div className="stat-card"><div className="stat-icon purple"><CheckCircle2/></div><div><small>Marked learned</small><strong>{known.length}</strong><span>Out of {mergedItems.length}</span></div></div>
          <div className="stat-card"><div className="stat-icon gold"><Zap/></div><div><small>Quiz accuracy</small><strong>{scores.done ? Math.round(scores.correct/scores.done*100) : 0}%</strong><span>{scores.done} questions attempted</span></div></div>
        </div>

        <div className="section-heading"><div><span className="eyebrow">QUICK ACCESS</span><h2>Pick up where you left off</h2></div><button className="text-button" onClick={()=>setPage("menu")}>All menu items <ArrowRight size={15}/></button></div>
        <div className="category-grid">{categories.filter(c=>c!=="All").slice(0,8).map((c,i)=><button className={`category-tile tile-${i%4}`} key={c} onClick={()=>{setCategory(c);setPage("menu");}}><span className="category-emoji">{categoryEmoji[c]||"🍽️"}</span><span><b>{c}</b><small>{mergedItems.filter(m=>m.category===c).length} items to learn</small></span><ChevronRight size={17}/></button>)}</div>

        <div className="section-heading"><div><span className="eyebrow">STUDY SMARTER</span><h2>Three simple learning moves</h2></div></div>
        <div className="feature-grid">
          <div className="feature-card"><div className="feature-icon">01</div><h3>Learn the item</h3><p>Open an item to review its listed price and ingredient notes.</p></div>
          <div className="feature-card"><div className="feature-icon">02</div><h3>Save what matters</h3><p>Bookmark confusing prices or ingredients for quick revision.</p></div>
          <div className="feature-card"><div className="feature-icon">03</div><h3>Practise recall</h3><p>Take the quiz and watch your accuracy improve over time.</p></div>
        </div>
        <div className="notice"><Info size={18}/><div><b>Menu accuracy matters</b><p>Some tiny labels in the uploaded photo are blurry. Items marked “Verify” should be checked against the café’s current printed menu or kitchen recipe before quoting them to a customer.</p></div></div>
      </section>}

      {(page==="menu"||page==="saved") && <section className="page-wrap">
        <div className="page-heading"><div><span className="eyebrow">THE MENU LIBRARY</span><h1>{pageTitle}</h1><p>Search an item, open its details, or mark it for revision.</p></div><div className="heading-count"><b>{filtered.length}</b><small>items shown</small></div></div>
        <div className="search-row"><div className="search-box"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search burgers, pizza, ingredients…"/></div><div className="filter-select"><SlidersHorizontal size={17}/><select value={category} onChange={e=>setCategory(e.target.value)} aria-label="Filter category">{categories.map(c=><option key={c}>{c}</option>)}</select></div></div>
        <div className="category-chips">{categories.map(c=><button key={c} className={category===c?"chip active":"chip"} onClick={()=>setCategory(c)}>{c==="All"?"✦ ":categoryEmoji[c]||""} {c}</button>)}</div>
        {filtered.length===0 ? <div className="empty-state"><Search size={34}/><h3>No items found</h3><p>Try another search or choose a different category.</p></div> :
          <div className="menu-grid">{filtered.map((item,i)=><article key={item.id} className="menu-card" style={{"--delay":`${(i%8)*45}ms`}}>
            <div className={`food-art art-${i%6}`}><span>{categoryEmoji[item.category]||"🍽️"}</span><button className={`save-btn ${saved.includes(item.id)?"saved":""}`} onClick={()=>toggleSaved(item.id)} aria-label="Save item"><Bookmark size={17} fill={saved.includes(item.id)?"currentColor":"none"}/></button><small>{item.category}</small></div>
            <div className="menu-card-body"><div className="card-title-row"><h3>{item.name}</h3>{known.includes(item.id)&&<CheckCircle2 size={16} className="learned-icon"/>}</div><div className="price-line"><CircleDollarSign size={15}/><span>{item.price}</span></div><div className={`status-tag ${item.status==="check"?"verify":item.status==="user-edited"?"edited":"partial"}`}>{item.status==="check"?"Verify details":item.status==="user-edited"?"Your update":"Partly readable / verify"}</div><button className="card-open" onClick={()=>openItem(item)}>View ingredients & notes <ArrowRight size={15}/></button></div>
          </article>)}</div>
        }
      </section>}

      {page==="quiz" && <section className="page-wrap quiz-page">
        <div className="page-heading"><div><span className="eyebrow">ACTIVE RECALL</span><h1>Train your menu memory.</h1><p>Choose an answer, check it, and read the explanation.</p></div><button className="btn-outline" onClick={resetQuiz}><RotateCcw size={16}/> Restart quiz</button></div>
        <div className="quiz-layout">
          <div className="quiz-main-card">
            <div className="quiz-top"><span className="quiz-label"><Brain size={16}/> MENU KNOWLEDGE</span><span className="question-number">QUESTION {quizIndex+1} / {quizOrder.length}</span></div>
            <div className="progress-track"><div style={{width:`${((quizIndex+1)/quizOrder.length)*100}%`}}/></div>
            <div className="question-mark">?</div>
            <h2>{activeQuiz.q}</h2>
            <div className="answer-options">{activeQuiz.options.map((option,i)=><button key={option} disabled={checkedAnswer} className={`answer-option ${chosen===option?"selected":""} ${checkedAnswer&&option===activeQuiz.answer?"right":checkedAnswer&&chosen===option&&chosen!==activeQuiz.answer?"wrong":""}`} onClick={()=>setChosen(option)}><span className="option-letter">{String.fromCharCode(65+i)}</span>{option}{checkedAnswer&&option===activeQuiz.answer&&<CheckCircle2 size={18}/>}</button>)}</div>
            {checkedAnswer&&<div className={`answer-explanation ${chosen===activeQuiz.answer?"correct":"incorrect"}`}><b>{chosen===activeQuiz.answer?"Correct — shabash!":"Not quite — keep practising."}</b><p>{activeQuiz.why}</p></div>}
            <div className="quiz-footer"><span><ShieldCheck size={16}/> Progress saves on this device</span>{!checkedAnswer?<button className="btn-primary" disabled={!chosen} onClick={checkAnswer}>Check answer <ArrowRight size={16}/></button>:<button className="btn-primary" onClick={nextQuestion}>Next question <ArrowRight size={16}/></button>}</div>
          </div>
          <aside className="quiz-side">
            <div className="score-card"><div className="score-ring"><span>{scores.done?Math.round(scores.correct/scores.done*100):0}%</span></div><h3>Your accuracy</h3><p>{scores.correct} correct out of {scores.done} answered</p></div>
            <div className="quiz-tip"><Sparkles size={18}/><div><b>Pro tip</b><p>Say the answer aloud before selecting it. This helps you remember it when a customer asks.</p></div></div>
            <div className="quiz-tip"><Info size={18}/><div><b>Honest learning</b><p>Questions use readable menu text. Blurry prices and unverified recipes are clearly flagged.</p></div></div>
          </aside>
        </div>
      </section>}

      {page==="progress" && <section className="page-wrap">
        <div className="page-heading"><div><span className="eyebrow">YOUR LEARNING JOURNEY</span><h1>Small steps add up.</h1><p>Your learning marks and quiz scores are stored locally in this browser.</p></div><button className="btn-outline" onClick={exportBackup}><Download size={16}/> Export backup</button></div>
        <div className="progress-hero"><div><span className="eyebrow">OVERALL LEARNING</span><h2>{Math.round(known.length/mergedItems.length*100)}% <span>of items marked learned</span></h2><div className="wide-progress"><div style={{width:`${known.length/mergedItems.length*100}%`}}/></div><p>{known.length} out of {mergedItems.length} items marked as learned.</p></div><div className="progress-emoji">🏆</div></div>
        <div className="stats-grid progress-stats"><div className="stat-card"><div className="stat-icon mint"><Trophy/></div><div><small>Correct answers</small><strong>{scores.correct}</strong><span>Quiz total</span></div></div><div className="stat-card"><div className="stat-icon purple"><Brain/></div><div><small>Questions tried</small><strong>{scores.done}</strong><span>Across sessions</span></div></div><div className="stat-card"><div className="stat-icon orange"><Bookmark/></div><div><small>Saved for review</small><strong>{saved.length}</strong><span>Items bookmarked</span></div></div></div>
        <div className="section-heading"><div><span className="eyebrow">BACKUP & RESTORE</span><h2>Keep your learning data safe</h2></div></div>
        <div className="backup-card"><div><h3>Export your backup</h3><p>Download a JSON file containing saved items, learned marks, quiz scores and your edits.</p><button className="btn-primary" onClick={exportBackup}><Download size={16}/> Download backup</button></div><div className="backup-divider"></div><div><h3>Restore a backup</h3><p>Choose a backup JSON file previously exported from this app.</p><label className="btn-outline file-button"><RotateCcw size={16}/> Choose backup file<input type="file" accept=".json,application/json" onChange={importBackup} hidden/></label></div></div>
      </section>}

      <footer className="footer"><span>✦ DELIGHT CAFÉ · MENU MASTER</span><span>Built for learning · Works best after verifying current menu details</span></footer>
    </main>

    {selected && <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}><section className="item-modal" role="dialog" aria-modal="true" aria-label={selected.name}>
      <div className="modal-art"><button className="modal-close icon-btn" onClick={()=>setSelected(null)} aria-label="Close"><X/></button><span>{categoryEmoji[selected.category]||"🍽️"}</span><small>{selected.category}</small><h2>{selected.name}</h2></div>
      <div className="modal-body">
        <div className="modal-price"><small>MENU PRICE</small><strong>{selected.price}</strong></div>
        <div className={`detail-warning ${selected.status==="check"?"warning-strong":""}`}><Info size={17}/><span>{selected.status==="check"?"Price/recipe needs checking against the current café menu.":"This is a learning note, not a guaranteed kitchen recipe. Confirm uncertain details with café staff."}</span></div>
        <h3><Leaf size={17}/> Ingredients / ingredients ka idea</h3>
        <ul className="ingredient-list">{selected.ingredients.map((ingredient,i)=><li key={i}><span>✦</span>{ingredient}</li>)}</ul>
        <div className="staff-note"><b>Staff note</b><p>{selected.note}</p></div>
        {adminEdit ? <div className="edit-fields"><label>Price / size prices<textarea value={draftPrice} onChange={e=>setDraftPrice(e.target.value)} rows={2}/></label><label>Ingredients — one per line<textarea value={draftIngredients} onChange={e=>setDraftIngredients(e.target.value)} rows={5}/></label><p>Only save verified information from your current printed menu or kitchen recipe.</p><button className="btn-primary" onClick={saveCustom}>Save my update</button></div> :
          <div className="modal-actions"><button className={`btn-outline ${known.includes(selected.id)?"is-known":""}`} onClick={()=>markKnown(selected.id)}>{known.includes(selected.id)?<CheckCircle2 size={16}/>:<BookOpen size={16}/>} {known.includes(selected.id)?"Marked learned":"Mark as learned"}</button><button className="btn-outline" onClick={()=>toggleSaved(selected.id)}><Bookmark size={16} fill={saved.includes(selected.id)?"currentColor":"none"}/>{saved.includes(selected.id)?"Saved":"Save for revision"}</button><button className="btn-text-small" onClick={()=>setAdminEdit(true)}>Edit details</button></div>}
      </div>
    </section></div>}
    {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
  </div>;
}

createRoot(document.getElementById("root")).render(<App/>);
