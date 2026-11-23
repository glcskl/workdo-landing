import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, CalendarRange, ChartNoAxesCombined, Check, ChevronDown,
  CircleCheck, Clock3, Database, FileSpreadsheet, KeyRound, LayoutDashboard, Laptop,
  LockKeyhole, MapPinned, Menu, Plus, ReceiptText, ScrollText, ShieldCheck,
  Siren, Sparkles, UsersRound, X, Download, Play, ChevronRight, Minus,
} from 'lucide-react';
import {
  NAV, HERO_TAGS, STATS, PAINS, MODULES, STEPS, WEEKS, ROLES, VERTICALS,
  TRUST, AUDIT, PLANS, FLOWS, FAQ, DEMO_NAV, DEMO_SHIFTS, DEMO_INCIDENTS,
  DEMO_MONTHS, DEMO_OBJECTS,
} from './data.js';

const ICONS = {
  LayoutDashboard, CalendarRange, ChartNoAxesCombined, Database, FileSpreadsheet,
  KeyRound, MapPinned, ReceiptText, ScrollText, ShieldCheck, Siren, UsersRound,
  Clock3, Sparkles, LockKeyhole,
};

function Icon({ name, size = 20, ...rest }) {
  const C = ICONS[name] || Sparkles;
  return <C size={size} strokeWidth={1.7} {...rest} />;
}

const EASE = [0.16, 1, 0.3, 1];

function Reveal({ children, delay = 0, className = '', y = 22, as = 'div', ...rest }) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      className={className}
      {...rest}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px -8% 0px' }}
      transition={{ duration: 0.65, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

function Counter({ to, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    let frame;
    const start = performance.now();
    const duration = 1300;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setValue(Math.round(to * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, to]);

  return <span ref={ref}>{value}{suffix}</span>;
}

function SectionHead({ label, title, note, center = false, dark = false, children }) {
  return (
    <Reveal className={`section-head ${center ? 'is-center' : ''} ${dark ? 'is-dark' : ''}`}>
      <div className="eyebrow"><span className="eyebrow-dot" />{label}</div>
      <h2 className="section-title">{title}</h2>
      {note && <p className="section-note">{note}</p>}
      {children}
    </Reveal>
  );
}

function Logo({ compact = false }) {
  return (
    <a className={`logo ${compact ? 'logo--compact' : ''}`} href="#top" aria-label="WorkDo — на главную">
      <span className="logo-mark" aria-hidden="true">
        <span /><span /><span />
      </span>
      <span className="logo-word">Work<span className="gradient-text">Do</span></span>
    </a>
  );
}

function Header({ onDemo }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header-inner container">
        <Logo />
        <nav className="header-nav" aria-label="Основная навигация">
          {NAV.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>
        <div className="header-actions">
          <button className="btn btn--ghost btn--sm header-demo" onClick={onDemo}>Демо</button>
          <a className="btn btn--dark btn--sm" href="/workdo-landing/register/">Регистрация <ArrowUpRight size={15} /></a>
          <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Закрыть меню' : 'Открыть меню'}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            {NAV.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}<ChevronRight size={16} /></a>
            ))}
            <button onClick={() => { setOpen(false); onDemo(); }}>Открыть демо <ArrowUpRight size={16} /></button>
            <a href="/workdo-landing/register/">Регистрация <ArrowUpRight size={16} /></a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function MacFrame({ children, onClick, modal = false, expanded = false, animate = false, label = 'Открыть живое демо WorkDo' }) {
  const Wrapper = animate ? motion.div : 'div';
  const animation = animate
    ? {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.55, duration: 1, ease: EASE },
      }
    : {};
  return (
    <Wrapper className={`mac-wrap ${animate ? 'mac-wrap--hero' : ''}`} {...animation}>
      <div
        className={`mac ${onClick ? 'is-clickable' : ''} ${modal ? 'mac--modal' : ''} ${expanded ? 'is-expanded' : ''}`}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        aria-label={onClick ? label : undefined}
        onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      >
        <div className="mac__lid">
          <div className="mac__bezel">
            <span className="mac__camera" aria-hidden="true" />
            <div className="mac__screen">{children}</div>
          </div>
        </div>
        <div className="mac__base" aria-hidden="true"><span className="mac__groove" /></div>
      </div>
    </Wrapper>
  );
}

function MiniDashboard() {
  return (
    <div className="hero-window">
      <div className="window-bar">
        <span className="window-dots"><i /><i /><i /></span>
        <span className="window-title">WorkDo · ЧОП «Редут» · 17 ноября 2026</span>
        <span className="window-live"><span /> live</span>
      </div>
      <div className="window-body">
        <aside className="window-side">
          {DEMO_NAV.slice(0, 6).map((n, i) => (
            <span key={n.id} className={i === 0 ? 'active' : ''}><Icon name={n.icon} size={15} />{n.label}</span>
          ))}
        </aside>
        <div className="window-main">
          <div className="window-kpis">
            <div><small>На смене</small><b>18 <em>из 31</em></b></div>
            <div><small>Постов</small><b>18</b></div>
            <div><small>Инцидентов</small><b>3 <em>1 высокий</em></b></div>
          </div>
          <div className="window-columns">
            <div className="window-card">
              <div className="window-card-head"><span>Смены на 10 дней</span><small>сегодня · 18</small></div>
              <div className="mini-bars">
                {[52, 74, 40, 88, 62, 95, 45, 70, 84, 58].map((h, i) => (
                  <span key={i} style={{ height: `${h}%` }} className={i === 3 || i === 5 ? 'is-night' : ''} />
                ))}
              </div>
              <div className="mini-legend"><span>Дневная</span><span>Ночная</span><span>Сутки</span></div>
            </div>
            <div className="window-card">
              <div className="window-card-head"><span>Последние инциденты</span><small>3 открыто</small></div>
              {DEMO_INCIDENTS.slice(0, 2).map((inc) => (
                <div className="mini-incident" key={inc.id}>
                  <span className={`sev sev--${inc.severity === 'высокая' ? 'high' : 'mid'}`} />
                  <span><b>{inc.title}</b><small>{inc.place} · {inc.time.slice(0, 10)}</small></span>
                </div>
              ))}
              <div className="mini-tag">БЦ «Север» · смена 08:00 <em>в работе</em></div>
            </div>
          </div>
        </div>
      </div>
      <motion.div
        className="float-chip float-chip--one"
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <CircleCheck size={16} /> Смена закрыта — табель обновился
      </motion.div>
      <motion.div
        className="float-chip float-chip--two"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ArrowRight size={16} /> Инцидент → ущерб в финансах
      </motion.div>
    </div>
  );
}

function Hero({ onDemo }) {
  return (
    <section className="hero" id="top">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-glow hero-glow--one" aria-hidden="true" />
      <div className="hero-glow hero-glow--two" aria-hidden="true" />
      <div className="hero-orbit" aria-hidden="true" />
      <div className="container hero-inner">
        <motion.div className="hero-badge" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
          <span className="pulse-dot" /> Система управления бизнесом
        </motion.div>
        <h1 className="hero-title">
          <motion.span initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
            WorkDo:
          </motion.span>
          <motion.span className="gradient-text animated-gradient" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.9, ease: EASE }}>
            бизнес под контролем
          </motion.span>
        </h1>
        <motion.p className="hero-sub" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.7, ease: EASE }}>
          От кадров до финансов: сотрудники, смены, заработная плата и финансы в одной системе.
        </motion.p>
        <motion.div className="hero-actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.7, ease: EASE }}>
          <button className="btn btn--dark btn--lg" onClick={onDemo}>Потрогать демо <ArrowRight size={17} /></button>
          <a className="btn btn--ghost btn--lg" href="#pricing">Смотреть тарифы</a>
        </motion.div>
        <motion.div className="hero-meta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }}>
          <span><Check size={13} /> без регистрации</span>
          <span><Check size={13} /> данные вымышленные</span>
          <span><Check size={13} /> ≈ 3 минуты</span>
          <span className="hero-meta__live">живой интерфейс · не скриншот</span>
        </motion.div>
        <MacFrame animate onClick={onDemo} label="Открыть живое демо WorkDo">
          <MiniDashboard />
        </MacFrame>
        <div className="mac-hint">Нажмите на ноутбук, чтобы открыть живое демо <ArrowUpRight size={13} /></div>
      </div>
      <div className="scroll-cue" aria-hidden="true"><span /><small>листайте</small></div>
    </section>
  );
}

function Marquee() {
  const items = [...HERO_TAGS, ...HERO_TAGS];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((tag, i) => <span key={i}>{tag}<i>✳</i></span>)}
      </div>
    </div>
  );
}

function StatsSection() {
  return (
    <section className="section section--tint stats-section" id="system">
      <div className="container">
        <SectionHead
          center
          label="система в цифрах"
          title={<>Не «ещё одна CRM», а <span className="gradient-text">рабочая среда</span></>}
          note="Справочники, операции и деньги связаны между собой. Поэтому цифры ниже — не обещания, а состав продукта."
        />
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <Reveal key={s.label} className="stat" delay={i * 0.08}>
              <div className="stat-value gradient-text"><Counter to={s.value} /></div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-note">{s.note}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Problems() {
  return (
    <section className="section problems" id="problem">
      <div className="container">
        <SectionHead
          label="01 · проблема"
          title={<>Бизнес живёт в <span className="gradient-text">семи файлах</span></>}
          note="И в каждом — своя версия правды. Пока данные расходятся по таблицам и чатам, управление превращается в пересказ."
        />
        <div className="compare-head">
          <span>как обычно</span><span>как в WorkDo</span>
        </div>
        <div className="compare-grid">
          {PAINS.map((p, i) => (
            <Reveal className="compare-row" key={p.old} delay={i * 0.07}>
              <div className="compare-card compare-card--old">
                <span className="compare-mark"><X size={15} /></span>
                <div><h3>{p.old}</h3><p>{p.oldText}</p></div>
              </div>
              <div className="compare-arrow"><ArrowRight size={18} /></div>
              <div className="compare-card compare-card--new">
                <span className="compare-mark"><Check size={15} /></span>
                <div><h3>{p.now}</h3><p>{p.nowText}</p></div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoTasks({ task, onDone }) {
  const tasks = [
    { id: 'role', label: 'Переключите роль — интерфейс изменится' },
    { id: 'shift', label: 'Проведите смену до завершения' },
    { id: 'incident', label: 'Создайте инцидент и закройте его' },
    { id: 'export', label: 'Выгрузите отчёт в CSV' },
  ];
  return (
    <div className="demo-tasks">
      <div className="demo-tasks__head"><span>на экране</span><b>{task.filter((id) => id !== 'role').length} / 3</b></div>
      {tasks.map((t) => (
        <button key={t.id} className={`demo-task ${task.includes(t.id) ? 'is-done' : ''}`} onClick={() => onDone(t.id)}>
          <span>{task.includes(t.id) ? <Check size={13} /> : <Plus size={13} />}</span>{t.label}
        </button>
      ))}
    </div>
  );
}

function DemoOverview({ onAction }) {
  return (
    <div className="demo-view">
      <div className="demo-kpis">
        <div className="demo-kpi"><small>На смене</small><b>18 <em>из 31 сотрудника</em></b><span className="kpi-delta">сегодня по графику · 18</span></div>
        <div className="demo-kpi"><small>Посты</small><b>18</b><span>5 объектов на обслуживании</span></div>
        <div className="demo-kpi"><small>Инциденты</small><b>3</b><span className="kpi-warn">1 высокого приоритета</span></div>
        <div className="demo-kpi"><small>ФОТ · ноябрь</small><b>2 480 000 ₽</b><span className="kpi-delta">+3,1% к плану</span></div>
      </div>
      <div className="demo-panels">
        <div className="demo-panel">
          <div className="demo-panel__head"><b>Последние инциденты</b><button onClick={() => onAction('incidents')}>все <ArrowRight size={13} /></button></div>
          {DEMO_INCIDENTS.slice(0, 2).map((inc) => (
            <div className="incident-line" key={inc.id}>
              <span className={`sev sev--${inc.severity === 'высокая' ? 'high' : inc.severity === 'средняя' ? 'mid' : 'low'}`} />
              <span><b>{inc.title}</b><small>{inc.place} · {inc.time.slice(0, 10)}</small></span>
              <em>{inc.status}</em>
            </div>
          ))}
        </div>
        <div className="demo-panel">
          <div className="demo-panel__head"><b>Кто на смене</b><button onClick={() => onAction('shifts')}>график <ArrowRight size={13} /></button></div>
          {DEMO_SHIFTS.slice(0, 3).map((p) => (
            <div className="person-line" key={p.name}>
              <span className="avatar">{p.initials}</span>
              <span><b>{p.name}</b><small>{p.post}</small></span>
              <em className={p.status === 'В смене' ? 'ok' : ''}>{p.status}</em>
            </div>
          ))}
        </div>
      </div>
      <div className="demo-quick">
        <span>Быстрые переходы</span>
        {DEMO_NAV.slice(1, 6).map((n) => <button key={n.id} onClick={() => onAction(n.id)}><Icon name={n.icon} size={14} /> {n.label}</button>)}
      </div>
    </div>
  );
}

function DemoShifts({ onDone }) {
  const [extra, setExtra] = useState(0);
  return (
    <div className="demo-view">
      <div className="demo-view-head">
        <div><h3>Смены / ноябрь 2026</h3><p>Смена связывает сотрудника, пост и время. Завершённая смена уходит в табель.</p></div>
        <button className="demo-action" onClick={() => { setExtra((n) => n + 1); onDone('shift'); }}><Plus size={15} /> Добавить смену</button>
      </div>
      <div className="shift-week">
        {['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map((d, i) => (
          <div key={d} className="shift-day">
            <span>{d}</span>
            <b>{17 + i}</b>
            <div>
              {i % 3 !== 2 && <i className="shift-chip shift-chip--d">Д</i>}
              {i % 2 === 0 && <i className="shift-chip shift-chip--n">Н</i>}
              {i === 3 && <i className="shift-chip shift-chip--s">С</i>}
            </div>
          </div>
        ))}
      </div>
      <div className="shift-list">
        {DEMO_SHIFTS.map((p) => (
          <div className="shift-row" key={p.name}>
            <span className="avatar">{p.initials}</span>
            <div><b>{p.name}</b><small>{p.team} · {p.post}</small></div>
            <span className="mono">{p.type}</span>
            <em className={p.status === 'В смене' ? 'ok' : ''}>{p.status}</em>
            <button onClick={() => onDone('shift')}>Завершить</button>
          </div>
        ))}
        {extra > 0 && <div className="shift-added"><Check size={15} /> Смена добавлена на 18 ноября · {extra}</div>}
      </div>
      <div className="demo-hint"><Sparkles size={15} /> Сгенерировано {18 + extra} смен по шаблону. Табель обновляется автоматически.</div>
    </div>
  );
}

function DemoIncidents({ onDone }) {
  const [items, setItems] = useState(DEMO_INCIDENTS);
  const [form, setForm] = useState(false);
  const [title, setTitle] = useState('');
  const update = (id, status) => {
    setItems((all) => all.map((x) => (x.id === id ? { ...x, status } : x)));
    onDone('incident');
  };
  const create = () => {
    if (title.trim().length < 4) return;
    setItems((all) => [{ ...DEMO_INCIDENTS[0], id: Date.now(), title, status: 'открыт', severity: 'средняя' }, ...all]);
    setTitle(''); setForm(false); onDone('incident');
  };
  return (
    <div className="demo-view">
      <div className="demo-view-head">
        <div><h3>Происшествия · ноябрь 2026</h3><p>Категория, серьёзность, ущерб и корневая причина — обязательные поля расследования.</p></div>
        <button className="demo-action" onClick={() => setForm(!form)}><Plus size={15} /> Новый инцидент</button>
      </div>
      <AnimatePresence>
        {form && (
          <motion.div className="incident-form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Например: повреждён турникет на входе" />
            <button className="demo-action" onClick={create}>Создать инцидент</button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="incident-list">
        {items.map((inc) => (
          <div className="incident-card" key={inc.id}>
            <div className="incident-card__top">
              <span className="mono"># {inc.id}</span>
              <span className={`badge-sev badge-sev--${inc.severity === 'высокая' ? 'high' : inc.severity === 'средняя' ? 'mid' : 'low'}`}>{inc.severity}</span>
              <span className={`badge-status ${inc.status === 'закрыт' ? 'is-closed' : ''}`}>{inc.status}</span>
            </div>
            <h4>{inc.title}</h4>
            <p>{inc.place} · {inc.time}</p>
            <div className="incident-meta">
              <span>категория <b>{inc.category}</b></span>
              <span>ущерб <b>{inc.damage}</b></span>
              <span>причина <b>{inc.reason}</b></span>
            </div>
            <div className="incident-actions">
              {inc.status !== 'закрыт' ? (
                <>
                  <button onClick={() => update(inc.id, 'расследование')}>Взять в расследование</button>
                  <button className="is-primary" onClick={() => update(inc.id, 'закрыт')}>Закрыть инцидент</button>
                </>
              ) : <span className="closed-note"><Check size={14} /> Закрыт · ущерб в финансах</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DemoFinance({ onDone }) {
  const [exported, setExported] = useState(false);
  return (
    <div className="demo-view">
      <div className="demo-view-head">
        <div><h3>Деньги · июнь — ноябрь 2026</h3><p>Доходы, ФОТ и налоги собираются из операций. Бюджет показывает отклонение до закрытия месяца.</p></div>
        <button className="demo-action" onClick={() => { setExported(true); onDone('export'); }}><Download size={15} /> Выгрузить CSV</button>
      </div>
      <div className="finance-bars">
        {DEMO_MONTHS.map((m) => (
          <div className="finance-col" key={m.m}>
            <div className="finance-bar-wrap">
              <span className="finance-bar finance-bar--plan" style={{ height: `${m.plan}%` }} />
              <span className="finance-bar finance-bar--fact" style={{ height: `${m.fact}%` }} />
            </div>
            <small>{m.m}</small>
          </div>
        ))}
      </div>
      <div className="finance-legend"><span><i className="plan" /> План</span><span><i className="fact" /> Факт</span><b>ноябрь: +3,7% к плану</b></div>
      <div className="budget-table">
        <div className="budget-head"><span>Статья бюджета</span><span>План</span><span>Факт</span><span>Отклонение</span></div>
        {[['Охрана объектов', '1 420 000', '1 468 000', '+3,4%'], ['Оплата труда', '640 000', '662 000', '+3,4%'], ['Налоги и взносы', '238 000', '241 000', '+1,3%'], ['Транспорт', '82 000', '79 000', '−3,7%']].map((r) => (
          <div className="budget-row" key={r[0]}>{r.map((cell, i) => <span key={i} className={i === 3 ? 'delta' : ''}>{cell}</span>)}</div>
        ))}
      </div>
      {exported && <div className="demo-hint"><Check size={15} /> Финансы выгружены в CSV · UTF-8, разделитель «;»</div>}
    </div>
  );
}

function DemoObjects() {
  return (
    <div className="demo-view">
      <div className="demo-view-head">
        <div><h3>Объекты · 5 на обслуживании</h3><p>Пост знает своего клиента, инструкцию и маршрут обхода.</p></div>
        <span className="demo-hint-inline"><LockKeyhole size={14} /> Добавление отключено в демо</span>
      </div>
      <div className="object-grid">
        {DEMO_OBJECTS.map((o) => (
          <div className="object-card" key={o.name}>
            <div className="object-card__top"><Icon name="MapPinned" size={18} /><span className={o.status === 'Активен' ? 'ok' : 'warn'}>{o.status}</span></div>
            <h4>{o.name}</h4>
            <p>{o.address}</p>
            <div className="object-card__foot"><span>{o.posts} поста</span><span>инструкции · чекпоинты</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DemoStaff() {
  return (
    <div className="demo-view">
      <div className="demo-view-head">
        <div><h3>Кадры · 31 сотрудник</h3><p>Кадровые данные и лицензии доступны по роли. Импорт CSV/XLSX — 31 колонка, в демо отключён.</p></div>
        <button className="demo-action"><Download size={15} /> Импорт</button>
      </div>
      <div className="staff-table">
        <div className="staff-head"><span>Сотрудник</span><span>Должность</span><span>Лицензия</span><span>Ставка</span><span>Часы</span></div>
        {DEMO_SHIFTS.map((p, i) => (
          <div className="staff-row" key={p.name}>
            <span><i className="avatar avatar--sm">{p.initials}</i> {p.name}</span>
            <span>{['Охранник', 'Нач. смены', 'Охранник', 'Водитель'][i]}</span>
            <span className="mono">{['№ 4412 · до 12.27', '№ 3180 · до 08.27', '№ 5591 · до 03.28', '№ 2204 · до 11.26'][i]}</span>
            <span>{[220, 320, 210, 260][i]} ₽/ч</span>
            <span>{[168, 172, 160, 164][i]} ч</span>
          </div>
        ))}
      </div>
      <div className="demo-hint"><ShieldCheck size={15} /> Охранник видит только свою карточку. Остальные данные скрыты на уровне таблиц.</div>
    </div>
  );
}

function DemoReports({ onDone }) {
  const [last, setLast] = useState('');
  const rows = [
    ['График смен', '18 строк'], ['Сотрудники', '31 строка'], ['Инциденты', '3 строки'],
    ['Финансы и бюджет', '6 месяцев'], ['Табель', '31 строка'], ['ФОТ', '6 месяцев'],
  ];
  return (
    <div className="demo-view">
      <div className="demo-view-head">
        <div><h3>Отчёты и журнал действий</h3><p>Файл скачивается сразу, без «отправим на почту». Кодировка UTF-8, разделитель — точка с запятой.</p></div>
        <button className="demo-action" onClick={() => { setLast('Финансы и бюджет'); onDone('export'); }}><Download size={15} /> Выгрузить отчёт</button>
      </div>
      <div className="report-grid">
        {rows.map((r) => (
          <button key={r[0]} className="report-card" onClick={() => { setLast(r[0]); onDone('export'); }}>
            <FileSpreadsheet size={22} /><b>{r[0]}</b><small>{r[1]}</small><Download size={14} />
          </button>
        ))}
      </div>
      <div className="audit-mini">
        <div className="audit-mini__head"><ScrollText size={16} /> Журнал действий · аудит включён <em>только owner и admin</em></div>
        {AUDIT.slice(0, 3).map((a, i) => (
          <div className="audit-mini__row" key={i}>
            <span className="mono">{a.date} {a.time}</span><span>{a.who}</span><span>{a.field}</span>
            <span><s>{a.before}</s> <ArrowRight size={12} /> <b>{a.after}</b></span>
          </div>
        ))}
      </div>
      {last && <div className="demo-hint"><Check size={15} /> {last} выгружен в CSV</div>}
    </div>
  );
}

function DemoShell() {
  const [view, setView] = useState('overview');
  const [role, setRole] = useState('owner');
  const [tasks, setTasks] = useState([]);
  const [toast, setToast] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const mark = (id) => setTasks((all) => (all.includes(id) ? all : [...all, id]));
  const flash = (text) => {
    setToast(text);
    window.clearTimeout(flash.timer);
    flash.timer = window.setTimeout(() => setToast(''), 2600);
  };
  const go = (id) => {
    const roleView = ROLES.find((r) => r.id === role);
    if ((role === 'guard' && ['finance', 'reports', 'staff'].includes(id)) || (role === 'lead' && ['finance', 'reports'].includes(id))) {
      flash('Этот раздел недоступен для текущей роли');
      return;
    }
    setView(id);
    void roleView;
  };
  const chooseRole = (id) => {
    setRole(id);
    mark('role');
    if (id === 'guard' && ['finance', 'reports', 'staff'].includes(view)) setView('overview');
    if (id === 'lead' && ['finance', 'reports'].includes(view)) setView('overview');
    flash(`Роль: ${ROLES.find((r) => r.id === id).name} · доступ проверяется на сервере`);
  };

  const views = {
    overview: <DemoOverview onAction={go} />,
    shifts: <DemoShifts onDone={mark} />,
    staff: <DemoStaff />,
    objects: <DemoObjects />,
    incidents: <DemoIncidents onDone={mark} />,
    finance: <DemoFinance onDone={mark} />,
    reports: <DemoReports onDone={mark} />,
  };

  return (
        <div className={`demo-shell ${collapsed ? 'is-collapsed' : ''}`}>
          <div className="demo-topbar">
            <div className="demo-topbar__left"><span className="window-dots"><i /><i /><i /></span><b>Живое демо WorkDo</b><span className="demo-divider" /><span className="mono">ЧОП «Редут»</span></div>
            <div className="demo-topbar__right"><span className="demo-demo-tag">данные вымышленные</span><button onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Развернуть окно' : 'Свернуть окно'}>{collapsed ? <ChevronDown size={17} /> : <X size={17} />}</button></div>
          </div>
          {!collapsed && (
            <div className="demo-body">
              <aside className="demo-sidebar">
                <small>разделы демо</small>
                {DEMO_NAV.map((n) => {
                  const locked = (role === 'guard' && ['finance', 'reports', 'staff'].includes(n.id)) || (role === 'lead' && ['finance', 'reports'].includes(n.id));
                  return (
                    <button key={n.id} className={`${view === n.id ? 'is-active' : ''} ${locked ? 'is-locked' : ''}`} onClick={() => go(n.id)}>
                      <Icon name={n.icon} size={16} /> {n.label} {locked && <LockKeyhole size={13} />}
                    </button>
                  );
                })}
                <div className="demo-sidebar__foot"><span className="pulse-dot" /> доступ проверяется на сервере</div>
              </aside>
              <div className="demo-content">
                <div className="demo-rolebar">
                  <span>Роль в демо</span>
                  {ROLES.map((r) => <button key={r.id} className={role === r.id ? 'is-active' : ''} onClick={() => chooseRole(r.id)}>{r.short}</button>)}
                  <span className="mono demo-access">{ROLES.find((r) => r.id === role).access} / 19 разделов</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28, ease: EASE }}>
                    {views[view]}
                  </motion.div>
                </AnimatePresence>
              </div>
              <DemoTasks task={tasks} onDone={(id) => { mark(id); if (id === 'role') chooseRole(role); }} />
            </div>
          )}
          <AnimatePresence>
            {toast && <motion.div className="demo-toast" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>{toast}</motion.div>}
          </AnimatePresence>
        </div>
  );
}

function DemoModal({ open, onClose }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="demo-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="demo-modal__backdrop" onClick={onClose} />
          <motion.div
            className={`demo-modal__stage ${expanded ? 'is-full' : ''}`}
            initial={{ opacity: 0, y: 26, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="demo-modal__bar">
              <div className="demo-modal__bar-left">
                <span className="mono">живое демо · ЧОП «Редут»</span>
                <span className="demo-modal__bar-sep" />
                <span className="mono dim">данные вымышленные</span>
              </div>
              <div className="demo-modal__bar-right">
                <button
                  type="button"
                  className="demo-modal__icon"
                  onClick={() => setExpanded(!expanded)}
                  aria-label={expanded ? 'Вернуть обычный размер' : 'Развернуть ноутбук'}
                  title={expanded ? 'Обычный размер' : 'Развернуть'}
                >
                  <Laptop size={15} />
                </button>
                <button type="button" className="demo-modal__icon" onClick={onClose} aria-label="Закрыть демо"><X size={16} /></button>
              </div>
            </div>
            <MacFrame modal expanded={expanded}>
              <DemoShell />
            </MacFrame>
            <p className="demo-modal__hint">Смены, инциденты, роли и экспорт CSV работают внутри окна · Esc — закрыть</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DemoSection({ onDemo }) {
  return (
    <section className="section section--dark demo-section" id="demo">
      <div className="demo-glow" aria-hidden="true" />
      <div className="container">
        <SectionHead
          dark center label="02 · демо"
          title={<>Не скриншот. <span className="gradient-text">Живая система</span></>}
          note="Откройте демо и поработайте как владелец охранного предприятия: проведите смену, закройте инцидент, посмотрите финансы. Данные вымышленные — кнопки настоящие."
        >
          <div className="demo-badges"><span><Clock3 size={14} /> ≈ 3 минуты · без регистрации</span><span><Play size={13} /> живой интерфейс</span></div>
        </SectionHead>
        <div className="demo-preview">
          <MacFrame>
            <MiniDashboard />
          </MacFrame>
          <button className="btn btn--light demo-preview__btn" onClick={onDemo}>Открыть демо на весь экран <ArrowUpRight size={16} /></button>
        </div>
        <p className="demo-footnote">кликайте внутри: смены, инциденты, роли, экспорт CSV · демо иллюстрирует интерфейс продукта</p>
      </div>
    </section>
  );
}

function Modules() {
  const [filter, setFilter] = useState('Все');
  const list = filter === 'Все' ? MODULES : MODULES.filter((m) => m.kind === filter);
  return (
    <section className="section modules" id="modules">
      <div className="container">
        <SectionHead
          label="03 · модули"
          title={<>Всё для управления — <span className="gradient-text">в одном окне</span></>}
          note="Основа нужна каждому бизнесу: кадры, табель, зарплата, финансы. Отраслевые инструменты включаются модулями — без лишних экранов."
        >
          <div className="filter-row">
            {['Все', 'Основа', 'Модуль'].map((f) => (
              <button key={f} className={filter === f ? 'is-active' : ''} onClick={() => setFilter(f)}>{f === 'Все' ? 'Все разделы' : f === 'Основа' ? 'Основа' : 'Модули'}</button>
            ))}
          </div>
        </SectionHead>
        <motion.div className="module-grid" layout>
          <AnimatePresence mode="popLayout">
            {list.map((m, i) => (
              <motion.article
                layout
                key={m.id}
                className="module-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, delay: i * 0.035, ease: EASE }}
                whileHover={{ y: -6 }}
              >
                <div className="module-card__top">
                  <span className="module-icon"><Icon name={m.icon} size={22} /></span>
                  <span className="module-num mono">{m.num}</span>
                </div>
                <div className="module-kind mono">{m.kind} · {m.label}</div>
                <h3>{m.title}</h3>
                <p>{m.intro}</p>
                <ul>{m.bullets.slice(0, 3).map((b) => <li key={b}><Check size={13} /> {b}</li>)}</ul>
                <div className="module-stat"><b>{m.stat}</b><span>{m.statLabel}</span></div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function How() {
  return (
    <section className="section section--tint how" id="how">
      <div className="container">
        <SectionHead
          label="04 · внедрение"
          title={<>От таблиц до рабочей системы <span className="gradient-text">за месяц</span></>}
          note="Без «интеграторов на полгода». Переносим данные, включаем нужные модули, выдаём роли и остаёмся рядом."
        />
        <div className="steps">
          {STEPS.map((s, i) => (
            <Reveal className="step" key={s.num} delay={i * 0.08}>
              <div className="step-top"><span className="step-num mono">{s.num}</span><span className="step-time mono">{s.time}</span></div>
              <div className="step-line"><span /></div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </Reveal>
          ))}
        </div>
        <div className="week-band">
          {WEEKS.map((w, i) => (
            <Reveal className="week" key={w.week} delay={i * 0.06}>
              <span className="week-label mono">{w.week}</span>
              <h4>{w.title}</h4>
              <p>{w.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Roles() {
  const [active, setActive] = useState('owner');
  const role = ROLES.find((r) => r.id === active);
  return (
    <section className="section access" id="access">
      <div className="container">
        <SectionHead
          label="05 · доступ"
          title={<>У каждого — <span className="gradient-text">свой экран</span></>}
          note="Права ограничены на уровне таблиц, а не только меню. Начальник смены не увидит финансы, охранник — чужие объекты."
        />
        <div className="access-grid">
          <div className="role-pills">
            {ROLES.map((r) => (
              <button key={r.id} className={active === r.id ? 'is-active' : ''} onClick={() => setActive(r.id)}>
                <span className="role-avatar">{r.short.slice(0, 1)}</span>
                <span><b>{r.name}</b><small>{r.access} разделов</small></span>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div className="role-panel" key={active} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.35, ease: EASE }}>
              <div className="role-panel__head"><span className="mono">роль · {active}</span><span className="pulse-dot" /> доступ проверяется на сервере</div>
              <h3>{role.name}</h3>
              <p>{role.text}</p>
              <div className="access-meter">
                <div className="access-meter__top"><span>разделы системы</span><b>{role.access} из 19 доступно</b></div>
                <div className="access-bar"><span style={{ width: `${(role.access / 19) * 100}%` }} /></div>
              </div>
              <div className="access-chips">
                {MODULES.slice(0, 6).map((m, i) => {
                  const visible = i < Math.round((role.access / 19) * 6);
                  return <span key={m.id} className={visible ? 'is-open' : 'is-closed'}>{visible ? <Check size={13} /> : <LockKeyhole size={13} />} {m.label}</span>;
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Verticals() {
  const [active, setActive] = useState('security');
  const current = VERTICALS.find((v) => v.id === active);
  return (
    <section className="section section--tint verticals" id="verticals">
      <div className="container">
        <SectionHead
          label="06 · отрасли"
          title={<>Одна платформа, <span className="gradient-text">разные процессы</span></>}
          note="Основа общая: люди, смены, деньги. Отраслевые справочники подключаются модулями — без второй системы и второго аккаунта."
        />
        <div className="vertical-tabs">
          {VERTICALS.map((v) => <button key={v.id} className={active === v.id ? 'is-active' : ''} onClick={() => setActive(v.id)}>{v.tag}</button>)}
        </div>
        <AnimatePresence mode="wait">
          <motion.div className="vertical-card" key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: EASE }}>
            <div className="vertical-card__copy">
              <span className="vertical-tag mono">{current.tag} · модуль</span>
              <h3>{current.name}</h3>
              <p>{current.text}</p>
              <a href="#demo">открыть демо <ArrowUpRight size={16} /></a>
            </div>
            <div className="vertical-card__art">
              <div className="vertical-orbit" />
              {current.modules.map((m, i) => <span key={m} style={{ '--i': i }}>{m}</span>)}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="vertical-grid">
          {VERTICALS.map((v, i) => (
            <Reveal key={v.id} delay={i * 0.06} className="vertical-mini" onClick={() => setActive(v.id)}>
              <span className="mono">0{i + 1}</span><b>{v.name}</b><small>{v.modules.join(' · ')}</small>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Security() {
  return (
    <section className="section section--dark security" id="security">
      <div className="container">
        <SectionHead
          dark center label="07 · безопасность"
          title={<>Данные компании <span className="gradient-text">остаются компании</span></>}
          note="Изоляция, роли и журнал действий — не настройки на витрине, а архитектура: отдельная схема базы на каждого клиента и проверка прав на уровне данных."
        />
        <div className="trust-grid">
          {TRUST.map((t, i) => (
            <Reveal className="trust-card" key={t.title} delay={i * 0.07}>
              <span className="trust-icon"><Icon name={t.icon} size={22} /></span>
              <h3>{t.title}</h3>
              <p>{t.text}</p>
              <span className="trust-meta mono">{t.meta}</span>
            </Reveal>
          ))}
        </div>
        <Reveal className="audit-log" delay={0.15}>
          <div className="audit-log__head"><span><ScrollText size={16} /> аудит-лог · фрагмент</span><em><LockKeyhole size={13} /> только для owner и admin</em></div>
          <div className="audit-log__table">
            <div className="audit-log__row audit-log__row--head"><span>дата</span><span>время</span><span>кто</span><span>поле</span><span>изменение</span></div>
            {AUDIT.map((a, i) => (
              <div className="audit-log__row" key={i}>
                <span className="mono">{a.date}</span><span className="mono">{a.time}</span><span>{a.who}</span><span>{a.field}</span>
                <span className="audit-diff"><s>{a.before}</s><ArrowRight size={13} /><b>{a.after}</b></span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Pricing({ onDemo }) {
  const [yearly, setYearly] = useState(false);
  const fmt = (n) => new Intl.NumberFormat('ru-RU').format(n);
  return (
    <section className="section pricing" id="pricing">
      <div className="container">
        <SectionHead
          center label="08 · тарифы"
          title={<>Прозрачно: <span className="gradient-text">за людей и модули</span></>}
          note="Цены для охранного предприятия. Для других отраслей — свои тарифы; основа и подход те же."
        >
          <div className="billing-toggle">
            <button className={!yearly ? 'is-active' : ''} onClick={() => setYearly(false)}>Помесячно</button>
            <button className={yearly ? 'is-active' : ''} onClick={() => setYearly(true)}>За год <em>−15%</em></button>
          </div>
        </SectionHead>
        <div className="plans-grid">
          {PLANS.map((p, i) => {
            const price = yearly ? Math.round(p.price * 0.85) : p.price;
            return (
              <Reveal className={`plan ${p.popular ? 'plan--popular' : ''}`} key={p.id} delay={i * 0.07}>
                {p.popular && <span className="plan-badge">чаще всего</span>}
                <span className="plan-name mono">{p.name}</span>
                <p className="plan-note">{p.note}</p>
                <div className="plan-price"><b>{fmt(price)}</b><span>₽/мес</span></div>
                <div className="plan-limit mono">{p.limit}</div>
                <ul>{p.features.map((f) => <li key={f}><Check size={14} /> {f}</li>)}</ul>
                <button className={`btn ${p.popular ? 'btn--dark' : 'btn--outline'} btn--full`} onClick={onDemo}>
                  Попробовать <ArrowRight size={15} />
                </button>
              </Reveal>
            );
          })}
        </div>
        <p className="pricing-note">Все тарифы включают основу, обновления, поддержку на старте и неограниченные отчёты. НДС не облагается.</p>
      </div>
    </section>
  );
}

function Flows() {
  return (
    <section className="section flows" id="flows">
      <div className="container">
        <SectionHead
          label="09 · как это работает"
          title={<>Три операции, которые <span className="gradient-text">меняют день</span></>}
          note="Не абстрактная «автоматизация», а конкретные цепочки: смена → табель → зарплата, инцидент → причина → отчёт, месяц → план → факт."
        />
        <div className="flow-grid">
          {FLOWS.map((f, i) => (
            <Reveal className="flow-card" key={f.num} delay={i * 0.08}>
              <span className="mono flow-num">{f.num}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
              <div className="flow-chain">
                {f.chain.map((c, j) => (
                  <span key={c}><i>{j + 1}</i>{c}{j < f.chain.length - 1 && <ArrowRight size={14} />}</span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Launch() {
  return (
    <section className="section section--tint launch" id="launch">
      <div className="container launch-grid">
        <SectionHead
          label="10 · запуск"
          title={<>Четыре недели — <span className="gradient-text">и без Excel</span></>}
          note="Не «внедрение на полгода». Первый месяц — это перенос, настройка и обучение. Дальше система работает вместе с вами."
        />
        <div className="launch-list">
          {WEEKS.map((w, i) => (
            <Reveal className="launch-row" key={w.week} delay={i * 0.06}>
              <span className="mono">{w.week}</span><b>{w.title}</b><p>{w.text}</p><span className="launch-index mono">0{i + 1}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section faq" id="faq">
      <div className="container faq-grid">
        <SectionHead
          label="11 · вопросы"
          title={<>Отвечаем на всё, <span className="gradient-text">что спросят</span></>}
          note="Если чего-то не хватает — откройте демо или напишите. Отвечаем по делу, без «запросите коммерческое предложение»."
        />
        <div className="faq-list">
          {FAQ.map((item, i) => (
            <div className={`faq-item ${open === i ? 'is-open' : ''}`} key={item.q}>
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                <span>{item.q}</span><span className="faq-icon">{open === i ? <Minus size={17} /> : <Plus size={17} />}</span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div className="faq-answer" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
                    <p>{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', contact: '', company: '', size: 'до 10' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <section className="section section--dark final-cta" id="contact">
      <div className="cta-glow cta-glow--one" aria-hidden="true" />
      <div className="cta-glow cta-glow--two" aria-hidden="true" />
      <div className="container cta-grid">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" />12 · дальше</div>
          <h2 className="cta-title">Проверьте на <span className="gradient-text">своём процессе</span></h2>
          <p className="cta-note">Покажем систему на ваших задачах: смены, объекты, зарплата, инциденты. Если что-то не подходит — скажем прямо, а не «доработаем в следующем квартале».</p>
          <div className="cta-points">
            <span><Clock3 size={16} /> ответ в течение рабочего дня</span>
            <span><Database size={16} /> перенос данных на старте</span>
            <span><ShieldCheck size={16} /> без навязанных модулей</span>
          </div>
        </div>
        <Reveal className="cta-form-wrap" delay={0.1}>
          {sent ? (
            <div className="cta-success">
              <span><Check size={28} /></span>
              <h3>Записали</h3>
              <p>Спасибо, {form.name || 'коллега'}. В реальном продукте здесь появилась бы задача менеджеру — на этом лендинге форма демонстрационная.</p>
              <button className="btn btn--outline" onClick={() => setSent(false)}>Отправить ещё раз</button>
            </div>
          ) : (
            <form className="cta-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <div className="cta-form__head"><span>заявка на разбор</span><em>≈ 20 минут</em></div>
              <label><span>имя</span><input required value={form.name} onChange={set('name')} placeholder="Глеб" /></label>
              <label><span>телефон или telegram</span><input required value={form.contact} onChange={set('contact')} placeholder="@workdo" /></label>
              <label><span>компания</span><input value={form.company} onChange={set('company')} placeholder="ЧОП «Редут»" /></label>
              <label><span>сотрудников</span>
                <select value={form.size} onChange={set('size')}><option>до 10</option><option>до 30</option><option>до 100</option><option>100+</option></select>
              </label>
              <button className="btn btn--light btn--full" type="submit">Отправить заявку <ArrowRight size={16} /></button>
              <small>Форма демонстрационная: данные никуда не отправляются.</small>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ onDemo }) {
  const groups = [
    { title: 'ПРОДУКТ', links: [['Возможности', '#modules'], ['Тарифы', '#pricing'], ['Сценарии', '#flows'], ['Блог', '#faq']] },
    { title: 'КОМПАНИЯ', links: [['О нас', '#how'], ['Карьера', '#contact'], ['Контакты', '#contact'], ['Пресса', '#system']] },
    { title: 'ПОДДЕРЖКА', links: [['Документация', '#faq'], ['FAQ', '#faq'], ['Статус', '#system'], ['Связаться', '#contact']] },
    { title: 'ДОКУМЕНТЫ', links: [
      ['Политика конфиденциальности', '/workdo-landing/docs/#privacy'],
      ['Пользовательское соглашение', '/workdo-landing/docs/#terms'],
      ['Публичная оферта', '/workdo-landing/docs/#offer'],
    ] },
  ];
  return (
    <footer className="footer">
      <div className="container footer-workdo">
        <div className="footer-workdo__head">
          <div>
            <Logo />
            <p>WorkDo: бизнес под контролем</p>
            <small>От кадров до финансов: сотрудники, смены, заработная плата и финансы в одной системе.</small>
          </div>
          <button className="btn btn--dark btn--sm" onClick={onDemo}>
            Открыть демо <ArrowUpRight size={15} />
          </button>
        </div>
        <div className="footer-workdo__grid">
          {groups.map((group) => (
            <div key={group.title}>
              <h4>{group.title}</h4>
              {group.links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
            </div>
          ))}
        </div>
        <div className="footer-workdo__bottom">
          <span>© 2026 WorkDo. Все права защищены.</span>
          <div>
            <a href="mailto:info@workdo.ru">info@workdo.ru</a>
            <i>|</i>
            <a href="tel:+375297184884">+375 (29) 718-48-84</a>
            <i>|</i>
            <a href="tel:+79009904504">+7 (900) 990-45-04</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  const [demoOpen, setDemoOpen] = useState(false);

  const openDemo = () => setDemoOpen(true);
  const closeDemo = () => setDemoOpen(false);

  return (
    <div className="app">
      <motion.div className="scroll-progress" style={{ scaleX }} />
      <Header onDemo={openDemo} />
      <main>
        <Hero onDemo={openDemo} />
        <Marquee />
        <StatsSection />
        <Problems />
        <DemoSection onDemo={openDemo} />
        <Modules />
        <How />
        <Roles />
        <Verticals />
        <Security />
        <Pricing onDemo={openDemo} />
        <Flows />
        <Launch />
        <Faq />
        <FinalCta />
      </main>
      <Footer onDemo={openDemo} />
      <DemoModal open={demoOpen} onClose={closeDemo} />
    </div>
  );
}
