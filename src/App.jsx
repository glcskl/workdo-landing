import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import {
  Anchor, ArrowRight, ArrowUpRight, CalendarRange, ChartNoAxesCombined, Check, ChevronDown,
  ChevronLeft, CircleCheck, ClipboardList, Clock3, Database, FileSpreadsheet, KeyRound,
  LayoutDashboard, Laptop, LockKeyhole, MapPinned, Menu, Package, Plus, ReceiptText, ScrollText,
  ShieldCheck, Ship, Siren, Sparkles, UsersRound, X, Download, Play, ChevronRight, Minus, Search,
  Building2, Users, Wallet,
} from 'lucide-react';
import {
  NAV, STATS, PAINS, MODULES, STEPS, WEEKS, ROLES, VERTICALS, MODULE_DETAILS, STEP_DETAILS,
  TRUST, AUDIT, PLANS, FLOWS, FAQ, DEMO_NAV, DEMO_SHIFTS, DEMO_INCIDENTS,
  DEMO_MONTHS, DEMO_OBJECTS,
} from './data.js';

const ICONS = {
  LayoutDashboard, CalendarRange, ChartNoAxesCombined, Database, FileSpreadsheet,
  KeyRound, MapPinned, ReceiptText, ScrollText, ShieldCheck, Siren, UsersRound,
  Clock3, Sparkles, LockKeyhole, Building2, Users, Wallet,
};

const FLOW_ICONS = {
  'Смена': CalendarRange,
  'Табель': FileSpreadsheet,
  'Зарплата': Wallet,
  'Инцидент': Siren,
  'Причина': Search,
  'Отчёт': ScrollText,
  'Месяц': CalendarRange,
  'План': ChartNoAxesCombined,
  'Факт': ChartNoAxesCombined,
};

const VERTICAL_ICONS = {
  'Объекты': MapPinned,
  'Посты': ShieldCheck,
  'Патрули': Siren,
  'Табель': Clock3,
  'Графики': CalendarRange,
  'Услуги': Sparkles,
  'Клиенты': Users,
  'Зарплата': Wallet,
  'Экипажи': Users,
  'Суда': Ship,
  'Стоянки': Anchor,
  'Заявки': ClipboardList,
  'Сотрудники': Users,
  'Смены': CalendarRange,
  'Склад': Package,
};

/* Moves the gradient focus point to the cursor, exactly like workdo.ru. */
function useCursorGradient() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    let el = null;
    let x = 0;
    let y = 0;
    let frame = 0;
    const paint = () => {
      frame = 0;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      el.style.setProperty('--gx', `${((x - rect.left) / rect.width) * 100}%`);
      el.style.setProperty('--gy', `${((y - rect.top) / rect.height) * 100}%`);
    };
    const onMove = (event) => {
      const target = event.target?.closest?.('.cursor-gradient');
      if (!target) return;
      el = target;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
}

function Icon({ name, size = 20, ...rest }) {
  const C = ICONS[name] || Sparkles;
  return <C size={size} strokeWidth={1.7} {...rest} />;
}

const AVATAR_GROUPS = [
  ['СГ', 'МК', 'АП'],
  ['ДЛ', 'ИВ', 'НС'],
  ['ЕР', 'ТК', 'ВП'],
  ['ОМ', 'РШ', 'КД'],
];

function AvatarStack({ i = 0 }) {
  const group = AVATAR_GROUPS[i % AVATAR_GROUPS.length];
  return (
    <span className="avatar-stack" aria-hidden="true">
      {group.map((initials, n) => (
        <span className="avatar-stack__dot" key={initials} data-n={n}>{initials}</span>
      ))}
    </span>
  );
}

const EASE = [0.16, 1, 0.3, 1];
const REGISTER = '/workdo-landing/register/';
const LOGIN = '/workdo-landing/register/#login';

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
      {label && <div className="eyebrow"><span className="eyebrow-dot" />{label}</div>}
      <h2 className="section-title">{title}</h2>
      {note && <p className="section-note">{note}</p>}
      {children}
    </Reveal>
  );
}

function Logo() {
  return <a className="logo logo--workdo" href="#top" aria-label="WorkDo — на главную">WorkDo</a>;
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
        <div className="header-actions">
          <a className="header-login" href={LOGIN}>Войти</a>
          <a className="btn btn--dark btn--sm" href={REGISTER}>
            <span className="btn-full">Начать бесплатно</span>
            <span className="btn-short">Начать</span>
          </a>
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
            <a href={LOGIN} onClick={() => setOpen(false)}>Войти</a>
            <a href={REGISTER} onClick={() => setOpen(false)}>Начать бесплатно</a>
            <button onClick={() => { setOpen(false); onDemo(); }}>Открыть демо <ArrowUpRight size={16} /></button>
            {NAV.slice(2).map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}<ChevronRight size={16} /></a>
            ))}
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
          <div className="win-brand"><b>WorkDo</b><small>ЧОП «Редут»</small></div>
          <div className="win-nav-group"><span>Главная</span></div>
          <div className="win-nav-group"><small>Персонал</small><span><Icon name="UsersRound" size={14} /> Сотрудники</span><span><Icon name="Users" size={14} /> Бригады</span></div>
          <div className="win-nav-group"><small>Клиенты и объекты</small><span><Icon name="Building2" size={14} /> Клиенты</span><span><Icon name="MapPinned" size={14} /> Объекты</span><span><Icon name="ShieldCheck" size={14} /> Посты</span></div>
          <div className="win-nav-group"><small>Планирование</small><span><Icon name="CalendarRange" size={14} /> Смены</span></div>
          <div className="win-nav-group"><small>Контроль и исполнение</small><span><Icon name="Clock3" size={14} /> Учёт времени</span><span><Icon name="Siren" size={14} /> Инциденты</span></div>
          <div className="win-nav-group"><small>Финансы</small><span><Icon name="Wallet" size={14} /> Зарплата</span><span><Icon name="ChartNoAxesCombined" size={14} /> Финансы</span></div>
          <div className="win-side-foot">owner@redut.ru</div>
        </aside>
        <div className="window-main">
          <div className="win-page-head">
            <div><h4>Панель управления охранным предприятием</h4><small>ЧОП «Редут» · 17 ноября 2026</small></div>
            <div className="win-head-actions"><span>Добавить сотрудника</span><span>Смены</span></div>
          </div>
          <div className="window-kpis window-kpis--4">
            <div><small>Всего сотрудников</small><b>31</b><em>в базе компании</em></div>
            <div><small>Активных смен</small><b>18</b><em>Сейчас на посту</em></div>
            <div><small>Постов</small><b>18</b><em>Объекты охраны</em></div>
            <div><small>Инцидентов</small><b>3</b><em>Всего зарегистрировано</em></div>
          </div>
          <div className="win-mid">
            <div className="window-card win-stat-card">
              <div className="window-card-head"><span>Статистика инцидентов</span><small>Обзор по статусам и серьёзности</small></div>
              <div className="win-stat-cols">
                <div><b>По статусу</b><span><i className="dot dot--blue" />Открыты <em>2</em></span><span><i className="dot dot--amber" />В расследовании <em>1</em></span><span><i className="dot dot--gray" />Закрыты <em>12</em></span></div>
                <div><b>По серьёзности</b><span><i className="dot dot--blue" />Низкий <em>6</em></span><span><i className="dot dot--amber" />Средний <em>5</em></span><span><i className="dot dot--red" />Высокий <em>3</em></span></div>
                <div><b>По приоритету</b><span><i className="dot dot--gray" />Низкий <em>7</em></span><span><i className="dot dot--blue" />Средний <em>4</em></span><span><i className="dot dot--red" />Срочный <em>1</em></span></div>
              </div>
            </div>
            <div className="win-payroll">
              <div><small>Ближайшая выплата зарплаты</small><b>25 ноября, осталось 8 дн.</b><span>2 480 000 ₽ · 31 сотрудник</span></div>
              <span className="win-payroll-btn">Зарплаты</span>
            </div>
          </div>
          <div className="window-columns">
            <div className="window-card">
              <div className="window-card-head"><span>Активные смены</span><small>Сотрудники на посту прямо сейчас</small></div>
              {DEMO_SHIFTS.slice(0, 3).map((p) => (
                <div className="win-shift" key={p.name}><span className="win-avatar">{p.initials}</span><span><b>{p.name}</b><small>{p.post}</small></span><em>08:00 - 20:00</em></div>
              ))}
            </div>
            <div className="window-card">
              <div className="window-card-head"><span>Быстрые действия</span><small>Часто используемые функции</small></div>
              <div className="win-actions">
                {['Добавить сотрудника', 'Создать смену', 'Создать пост', 'Зарегистрировать инцидент', 'Отчёт по сменам'].map((a) => <span key={a}><i />{a}</span>)}
              </div>
            </div>
          </div>
          <div className="window-card win-incidents">
            <div className="window-card-head"><span>Последние инциденты</span><small>Журнал происшествий · 3 открыто</small></div>
            {DEMO_INCIDENTS.slice(0, 2).map((inc) => (
              <div className="mini-incident" key={inc.id}>
                <span className={`sev sev--${inc.severity === 'высокая' ? 'high' : 'mid'}`} />
                <span><b>{inc.title}</b><small>{inc.place} · {inc.time.slice(0, 10)}</small></span>
                <em className="win-sev">{inc.severity}</em>
              </div>
            ))}
          </div>
          <div className="window-flow">
            <div className="window-flow__head"><span>Одна цепочка за день</span><small>смена → табель → зарплата</small></div>
            <div className="window-flow__steps">
              <div className="window-flow__step">
                <small>01 · СМЕНА</small>
                <b>Смена закрыта</b>
                <em>Пост №2 · 08:00–20:00</em>
                <strong>Игорь Соколов</strong>
              </div>
              <div className="window-flow__step">
                <small>02 · ТАБЕЛЬ</small>
                <b>Табель обновлён</b>
                <em>ноябрь · 168 часов</em>
                <strong>+ 32 ч ночных</strong>
              </div>
              <div className="window-flow__step">
                <small>03 · ЗАРПЛАТА</small>
                <b>Зарплата рассчитана</b>
                <em>оклад + ночные + премия</em>
                <strong>86 400 ₽</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="float-chip float-chip--one">
        <CircleCheck size={16} /> Смена закрыта — табель обновился
      </div>
      <div className="float-chip float-chip--two">
        <ArrowRight size={16} /> Инцидент → ущерб в финансах
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero hero--workdo" id="top">
      <div className="hero-grid" aria-hidden="true" />
      <div className="container hero-inner">
        <motion.div className="badge" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
          <span className="badge-dot" />Система управления бизнесом
        </motion.div>
        <h1>
          <motion.span className="line ink-gradient" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
            WorkDo:
          </motion.span>
          <br />
          <motion.span className="line cursor-gradient" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.9, ease: EASE }}>
            бизнес под контролем
          </motion.span>
        </h1>
        <motion.p className="hero-sub" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.7, ease: EASE }}>
          От кадров до финансов: сотрудники, смены, заработная плата и финансы в одной системе. Отраслевые модули настраиваются под ваш бизнес.
        </motion.p>
        <motion.div className="hero-cta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.7, ease: EASE }}>
          <a className="btn btn-dark" href={REGISTER}>Начать бесплатно <ArrowRight size={14} /></a>
        </motion.div>
      </div>
      <div className="scroll-mouse" aria-hidden="true"><span /></div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="section section--tint stats-section" id="system">
      <div className="container">
        <SectionHead
          center
         
          title={<>Не «ещё одна CRM», а <span className="gradient-text">рабочая среда</span></>}
          note="Справочники, операции и деньги связаны между собой. Поэтому цифры ниже — не обещания, а состав продукта."
        />
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <Reveal key={s.label} className="stat" delay={i * 0.08}>
              <span className="stat-index mono">0{i + 1}</span>
              <span className={`stat-viz stat-viz--${s.viz}`} aria-hidden="true">
                {Array.from({ length: s.viz === 'posts' ? 6 : s.viz === 'layers' ? 4 : s.viz === 'bars' ? 9 : 19 }, (_, j) => <i key={j} />)}
              </span>
              <div className="stat-value gradient-text"><span className="stat-num">{s.value}</span></div>
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
  const [active, setActive] = useState(0);
  const pain = PAINS[active];
  const go = (n) => setActive((n + PAINS.length) % PAINS.length);

  return (
    <section className="section problems" id="problem">
      <div className="container">
        <SectionHead
          center
         
          title={<>Бизнес живёт в <span className="gradient-text">семи файлах</span></>}
          note="И в каждом — своя версия правды. Пока данные расходятся по таблицам и чатам, управление превращается в пересказ."
        />
        <div className="compare-carousel">
          <div className="compare-selector">
            <div className="compare-selector__terms" role="tablist" aria-label="Примеры проблем">
              {PAINS.map((item, i) => (
                <button
                  key={item.short}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  className={`compare-selector__term ${i === active ? 'is-active' : ''}`}
                  onClick={() => setActive(i)}
                >
                  <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                  <b>{item.short}</b>
                </button>
              ))}
            </div>
            <div className="compare-dial" style={{ '--dial-rotate': `${270 - active * 90}deg` }} aria-hidden="true">
              <div className="compare-dial__ring">
                {PAINS.map((item, i) => (
                  <span
                    key={item.short}
                    className={`compare-dial__node ${i === active ? 'is-active' : ''}`}
                    style={{ '--a': `${i * 90}deg` }}
                  >
                    <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                  </span>
                ))}
              </div>
              <div className="compare-dial__center">
                <span className="mono">{String(active + 1).padStart(2, '0')} / 04</span>
                <b>{pain.short}</b>
              </div>
              <span className="compare-dial__marker" />
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="compare-slide"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className="compare-side compare-side--old">
                <div className="compare-side__head">
                  <span className="compare-mark"><X size={15} /></span>
                  <span className="compare-side__label mono">КАК ОБЫЧНО</span>
                </div>
                <h3>{pain.old}</h3>
                <p>{pain.oldText}</p>
              </div>
              <div className="compare-mid" aria-hidden="true"><ArrowRight size={20} /></div>
              <div className="compare-side compare-side--new">
                <div className="compare-side__head">
                  <span className="compare-mark"><Check size={15} /></span>
                  <span className="compare-side__label mono">КАК В WORKDO</span>
                </div>
                <h3>{pain.now}</h3>
                <p>{pain.nowText}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="compare-nav">
            <button type="button" className="compare-nav__btn" onClick={() => go(active - 1)} aria-label="Предыдущий пример">
              <ChevronLeft size={18} />
            </button>
            <div className="compare-dots">
              {PAINS.map((item, i) => (
                <button key={item.short} type="button" className={`compare-dot ${i === active ? 'is-active' : ''}`} onClick={() => setActive(i)} aria-label={`Пример ${i + 1}`} />
              ))}
            </div>
            <span className="compare-count">{String(active + 1).padStart(2, '0')} / {String(PAINS.length).padStart(2, '0')}</span>
            <button type="button" className="compare-nav__btn" onClick={() => go(active + 1)} aria-label="Следующий пример">
              <ChevronRight size={18} />
            </button>
          </div>
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
      <div className="demo-view-title">
        <div><h3>Панель управления охранным предприятием</h3><p>ЧОП «Редут» · 17 ноября 2026</p></div>
        <div className="win-head-actions"><span>Добавить сотрудника</span><span>Смены</span></div>
      </div>
      <div className="demo-kpis">
        <div className="demo-kpi"><small>Всего сотрудников</small><b>31</b><span>в базе компании</span></div>
        <div className="demo-kpi"><small>Активных смен</small><b>18</b><span className="kpi-delta">Сейчас на посту</span></div>
        <div className="demo-kpi"><small>Посты</small><b>18</b><span>5 объектов на обслуживании</span></div>
        <div className="demo-kpi"><small>Инциденты</small><b>3</b><span className="kpi-warn">Всего зарегистрировано</span></div>
      </div>
      <div className="win-mid">
        <div className="window-card win-stat-card">
          <div className="window-card-head"><span>Статистика инцидентов</span><small>Обзор по статусам и серьёзности</small></div>
          <div className="win-stat-cols">
            <div><b>По статусу</b><span><i className="dot dot--blue" />Открыты <em>2</em></span><span><i className="dot dot--amber" />В расследовании <em>1</em></span><span><i className="dot dot--gray" />Закрыты <em>12</em></span></div>
            <div><b>По серьёзности</b><span><i className="dot dot--blue" />Низкий <em>6</em></span><span><i className="dot dot--amber" />Средний <em>5</em></span><span><i className="dot dot--red" />Высокий <em>3</em></span></div>
            <div><b>По приоритету</b><span><i className="dot dot--gray" />Низкий <em>7</em></span><span><i className="dot dot--blue" />Средний <em>4</em></span><span><i className="dot dot--red" />Срочный <em>1</em></span></div>
          </div>
        </div>
        <div className="win-payroll">
          <div><small>Ближайшая выплата зарплаты</small><b>25 ноября, осталось 8 дн.</b><span>2 480 000 ₽ · 31 сотрудник</span></div>
          <span className="win-payroll-btn">Зарплаты</span>
        </div>
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
          dark center
          title={<>Не скриншот. <span className="gradient-text">Живая система</span></>}
          note="Откройте демо и поработайте как владелец охранного предприятия: проведите смену, закройте инцидент, посмотрите финансы. Данные вымышленные — кнопки настоящие."
        >
          <div className="demo-badges"><span><Clock3 size={14} /> ≈ 3 минуты · без регистрации</span><span><Play size={13} /> живой интерфейс</span></div>
        </SectionHead>
        <div className="demo-preview">
          <MacFrame onClick={onDemo} label="Нажмите на экран ноутбука, чтобы открыть живое демо">
            <MiniDashboard />
            <span className="mac-click-hint"><Play size={12} /> нажмите на экран</span>
          </MacFrame>
          <button className="btn btn--light demo-preview__btn" onClick={onDemo}>Открыть демо на весь экран <ArrowUpRight size={16} /></button>
        </div>
        <p className="demo-footnote">нажмите на экран ноутбука, чтобы открыть демо · внутри: смены, инциденты, роли, экспорт CSV</p>
      </div>
    </section>
  );
}

function Modules() {
  const [filter, setFilter] = useState('Все');
  const [active, setActive] = useState(0);
  const list = filter === 'Все' ? MODULES : MODULES.filter((m) => m.kind === filter);
  const index = Math.min(active, list.length - 1);
  const m = list[index];
  const go = (n) => setActive((n + list.length) % list.length);
  const changeFilter = (f) => { setFilter(f); setActive(0); };

  return (
    <section className="section modules" id="modules">
      <div className="container">
        <SectionHead
          center
         
          title={<>Всё для управления <span className="gradient-text">в одном окне</span></>}
          note="Основа нужна каждому бизнесу: кадры, табель, зарплата, финансы. Отраслевые инструменты включаются модулями — без лишних экранов."
        >
          <div className="filter-row">
            {['Все', 'Основа', 'Модуль'].map((f) => (
              <button key={f} className={filter === f ? 'is-active' : ''} onClick={() => changeFilter(f)}>{f === 'Все' ? 'Все разделы' : f === 'Основа' ? 'Основа' : 'Модули'}</button>
            ))}
          </div>
        </SectionHead>
        <div className="module-carousel">
          <div className="module-tabs" role="tablist" aria-label="Разделы системы">
            {list.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                className={`module-tab ${i === index ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="module-tab__icon"><Icon name={item.icon} size={15} /></span>
                <span className="module-tab__num mono">{item.num}</span>{item.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.article
              key={m.id}
              className="module-slide"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className="module-slide__main">
                <div className="module-slide__top">
                  <span className="module-icon"><Icon name={m.icon} size={24} /></span>
                  <div>
                    <span className="module-kind mono">{m.kind} · {m.label}</span>
                    <span className="module-slide__index mono">{m.num} / {String(list.length).padStart(2, '0')}</span>
                  </div>
                </div>
                <h3>{m.title}</h3>
                <p>{m.intro}</p>
                <ul>{m.bullets.map((b) => <li key={b}><Check size={14} /> {b}</li>)}</ul>
              </div>
              <div className="module-slide__aside">
                <div className="module-preview">
                  <div className="module-preview__bar"><i /><i /><i /><span>workdo / {m.label}</span></div>
                  <div className="module-preview__body">
                    <div className="module-slide__stat"><b>{m.stat}</b><span>{m.statLabel}</span></div>
                    <div className="module-preview__rows">
                      {m.bullets.slice(0, 3).map((b, i) => <div key={b}><span className="mono">0{i + 1}</span>{b}</div>)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
          <div className="module-nav">
            <button type="button" className="module-nav__btn" onClick={() => go(index - 1)} aria-label="Предыдущий раздел"><ChevronLeft size={18} /></button>
            <div className="module-dots">
              {list.map((item, i) => (
                <button key={item.id} type="button" className={`module-dot ${i === index ? 'is-active' : ''}`} onClick={() => setActive(i)} aria-label={`Раздел ${i + 1}`} />
              ))}
            </div>
            <span className="module-count">{String(index + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}</span>
            <button type="button" className="module-nav__btn" onClick={() => go(index + 1)} aria-label="Следующий раздел"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

function How() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];
  const week = WEEKS[active];
  const go = (n) => setActive((n + STEPS.length) % STEPS.length);

  return (
    <section className="section section--tint how" id="how">
      <div className="container">
        <SectionHead
          center
         
          title={<>От таблиц до рабочей системы <span className="gradient-text">за месяц</span></>}
          note="Без «интеграторов на полгода». Переносим данные, включаем нужные модули, выдаём роли и остаёмся рядом."
        />
        <div className="how-carousel">
          <div className="how-track" role="tablist" aria-label="Этапы внедрения">
            {STEPS.map((s, i) => (
              <button
                key={s.num}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`how-track__item ${i === active ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="how-track__num mono">{s.num}</span>
                <span className="how-track__title">{s.title}</span>
                <span className="how-track__time mono">{s.time}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={step.num}
              className="how-slide"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className="how-slide__main">
                <div className="how-slide__meta mono"><span>ШАГ {step.num}</span><span>{step.time}</span></div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
              <div className="how-slide__week">
                <span className="how-slide__week-label mono">{week.week}</span>
                <h4>{week.title}</h4>
                <p>{week.text}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="how-nav">
            <button type="button" className="how-nav__btn" onClick={() => go(active - 1)} aria-label="Предыдущий этап"><ChevronLeft size={18} /></button>
            <div className="how-dots">
              {STEPS.map((s, i) => (
                <button key={s.num} type="button" className={`how-dot ${i === active ? 'is-active' : ''}`} onClick={() => setActive(i)} aria-label={`Этап ${i + 1}`} />
              ))}
            </div>
            <span className="how-count">{String(active + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}</span>
            <button type="button" className="how-nav__btn" onClick={() => go(active + 1)} aria-label="Следующий этап"><ChevronRight size={18} /></button>
          </div>
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
          center
         
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
              <div className="role-panel__copy">
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
              </div>
              <div className="role-phone-wrap" aria-hidden="true">
                <div className="phone">
                  <span className="phone__island" />
                  <div className="phone__screen">
                    <div className="phone__status"><span>9:41</span><span className="phone__icons">●●● ▰</span></div>
                    <div className="phone__app-head"><b>WorkDo</b><small>{role.name}</small></div>
                    <div className="phone__hero">
                      <small>ДОСТУПНО СЕЙЧАС</small>
                      <strong>{role.access} / 19</strong>
                      <span>разделов системы</span>
                    </div>
                    <div className="phone__list">
                      {MODULES.slice(0, 5).map((m, i) => {
                        const visible = i < Math.round((role.access / 19) * 5);
                        return (
                          <div key={m.id} className="phone__row">
                            <span className={`phone__row-icon ${visible ? 'is-open' : 'is-closed'}`}>{visible ? <Check size={11} /> : <LockKeyhole size={11} />}</span>
                            <span>{m.label}</span>
                            <i className={visible ? 'is-open' : ''} />
                          </div>
                        );
                      })}
                    </div>
                    <div className="phone__tabs"><i className="is-active" /><i /><i /><i /></div>
                  </div>
                </div>
                <span className="role-phone-caption">iPhone 18 Pro · экран роли</span>
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
  const [moduleIndex, setModuleIndex] = useState(0);
  const current = VERTICALS.find((v) => v.id === active);
  const index = VERTICALS.findIndex((v) => v.id === active);
  const selected = current.modules[moduleIndex] || current.modules[0];
  const SelectedIcon = VERTICAL_ICONS[selected] || Check;
  const chooseVertical = (v, i) => { setActive(v.id); setModuleIndex(0); };
  return (
    <section className="section section--tint verticals" id="verticals">
      <div className="container">
        <SectionHead
          center
         
          title={<>Одна платформа, <span className="gradient-text">разные процессы</span></>}
          note="Основа общая: люди, смены, деньги. Отраслевые справочники подключаются модулями — без второй системы и второго аккаунта."
        />
        <div className="vertical-promise">
          <span className="vertical-promise__icon"><Sparkles size={18} /></span>
          <p>Неважно, какой у вас бизнес. <b>Важно, что люди, смены и деньги — под контролем.</b></p>
        </div>
        <div className="vertical-tabs" role="tablist" aria-label="Отрасли">
          {VERTICALS.map((v, i) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={`vertical-tab ${i === index ? 'is-active' : ''}`}
              onClick={() => chooseVertical(v, i)}
            >
              <span className="vertical-tab__num mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="vertical-tab__name">{v.tag}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div className="vertical-card" key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: EASE }}>
            <div className="vertical-hero" data-count={String(current.modules.length).padStart(2, '0')}>
              <div className="vertical-hero__top">
                <span className="vertical-tag mono">{current.tag} · модуль</span>
                <span className="vertical-hero__count mono">{String(current.modules.length).padStart(2, '0')} <small>модуля подключено</small></span>
              </div>
              <h3>{current.name}</h3>
              <p>{current.text}</p>
              <a href="#demo" className="vertical-cta">открыть демо <ArrowUpRight size={16} /></a>
            </div>
            <div className="vertical-modules-panel">
              <div className="vertical-modules-head"><span>Модули в комплекте</span><span className="mono">{current.tag}</span></div>
              <div className="vertical-modules">
                {current.modules.map((m, i) => (
                  <button
                    type="button"
                    key={m}
                    className={`vertical-module ${i === moduleIndex ? 'is-active' : ''}`}
                    onClick={() => setModuleIndex(i)}
                    aria-pressed={i === moduleIndex}
                  >
                    <span className="vertical-module__icon"><AvatarStack i={i} /></span>
                    <span className="vertical-module__body">
                      <span className="vertical-module__num mono">0{i + 1}</span>
                      <b>{m}</b>
                    </span>
                    <ArrowUpRight size={15} className="vertical-module__arrow" />
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div className="vertical-module-detail" key={`${active}-${selected}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22, ease: EASE }}>
                  <div className="vertical-module-detail__top">
                    <span className="vertical-module-detail__icon"><SelectedIcon size={17} /></span>
                    <span className="mono">0{moduleIndex + 1} / 0{current.modules.length} · модуль</span>
                  </div>
                  <h4>{selected}</h4>
                  <p>{MODULE_DETAILS[selected] || 'Модуль входит в комплект и работает вместе с кадрами, табелем и финансами.'}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function Security() {
  return (
    <section className="section section--dark security" id="security">
      <div className="container">
        <SectionHead
          dark center
          title={<>Данные компании <span className="gradient-text">остаются компании</span></>}
          note="Изоляция, роли и журнал действий — не настройки на витрине, а архитектура: отдельная схема базы на каждого клиента и проверка прав на уровне данных."
        />
        <div className="security-board">
          <div className="security-board__bar">
            <span className="mono">АРХИТЕКТУРА / КОНТУР БЕЗОПАСНОСТИ</span>
            <span className="security-board__legend mono"><i /> 4 механизма · всегда включены</span>
          </div>
          <div className="security-bento">
            <Reveal as="article" className="security-card security-card--schema" delay={0.02}>
              <div className="security-card__head">
                <span className="security-card__num mono">01</span>
                <span className="security-card__icon"><Icon name={TRUST[0].icon} size={18} /></span>
                <div className="security-card__title">
                  <h3>{TRUST[0].title}</h3>
                  <span className="mono">{TRUST[0].meta}</span>
                </div>
              </div>
              <p>{TRUST[0].text}</p>
              <div className="sec-schema">
                <div className="sec-schema__db"><Database size={16} /> PostgreSQL <span>изоляция на уровне схемы</span></div>
                <div className="sec-schema__split" aria-hidden="true" />
                <div className="sec-schema__cards">
                  <div className="is-current"><b>company_1042</b><small>схема вашей компании</small><span>employees · shifts · payroll · incidents</span></div>
                  <div><b>company_1043</b><small>другая компания</small><span>employees · shifts · payroll · incidents</span></div>
                </div>
              </div>
            </Reveal>

            <Reveal as="article" className="security-card security-card--rbac" delay={0.08}>
              <div className="security-card__head">
                <span className="security-card__num mono">02</span>
                <span className="security-card__icon"><Icon name={TRUST[1].icon} size={18} /></span>
                <div className="security-card__title">
                  <h3>{TRUST[1].title}</h3>
                  <span className="mono">{TRUST[1].meta}</span>
                </div>
              </div>
              <p>{TRUST[1].text}</p>
              <div className="sec-rbac">
                <div className="sec-rbac__roles"><span className="is-active">owner</span><span>admin</span><span>manager</span><span>member</span></div>
                <div className="sec-rbac__table">
                  <div><span>employees</span><b>read · write</b></div>
                  <div><span>payroll</span><b>read · write</b></div>
                  <div><span>audit_log</span><b>read</b></div>
                  <div><span>company</span><b>delete</b></div>
                </div>
              </div>
            </Reveal>

            <Reveal as="article" className="security-card security-card--code" delay={0.14}>
              <div className="security-card__head">
                <span className="security-card__num mono">04</span>
                <span className="security-card__icon"><Icon name={TRUST[3].icon} size={18} /></span>
                <div className="security-card__title">
                  <h3>{TRUST[3].title}</h3>
                  <span className="mono">{TRUST[3].meta}</span>
                </div>
              </div>
              <p>{TRUST[3].text}</p>
              <div className="sec-code">
                <div className="sec-code__mail"><KeyRound size={16} /> confirmation@workdo.ru</div>
                <div className="sec-code__digits"><span>4</span><span>8</span><span>2</span><span>9</span><span>1</span><span>7</span></div>
                <div className="sec-code__meta"><span>TTL 10 мин</span><span>3 попытки</span></div>
              </div>
            </Reveal>

            <Reveal as="article" className="security-card security-card--audit" delay={0.2}>
              <div className="security-card__head">
                <span className="security-card__num mono">03</span>
                <span className="security-card__icon"><Icon name={TRUST[2].icon} size={18} /></span>
                <div className="security-card__title">
                  <h3>{TRUST[2].title}</h3>
                  <span className="mono">{TRUST[2].meta}</span>
                </div>
              </div>
              <p>{TRUST[2].text}</p>
              <div className="audit-log">
                <div className="audit-log__head">
                  <span>аудит-лог · фрагмент</span>
                  <em><span className="audit-live">LIVE</span> только для owner и admin</em>
                </div>
                <div className="audit-log__table">
                  <div className="audit-log__row audit-log__row--head"><span>дата</span><span>время</span><span>кто</span><span>поле</span><span>изменение</span></div>
                  {AUDIT.map((a, i) => (
                    <div className="audit-log__row" key={i}>
                      <span className="mono">{a.date}</span><span className="mono">{a.time}</span><span>{a.who}</span><span>{a.field}</span>
                      <span className="audit-diff"><s>{a.before}</s><ArrowRight size={13} /><b>{a.after}</b></span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
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
          center
          title={<>Платите за команду, <span className="gradient-text">не за экраны</span></>}
          note="Цены для охранного предприятия. Для других отраслей — свои тарифы; основа и подход те же."
        >
          <div className="billing-toggle">
            <button className={!yearly ? 'is-active' : ''} onClick={() => setYearly(false)}>
              {!yearly && <motion.span layoutId="billing-pill" className="billing-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <span>Помесячно</span>
            </button>
            <button className={yearly ? 'is-active' : ''} onClick={() => setYearly(true)}>
              {yearly && <motion.span layoutId="billing-pill" className="billing-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <span>За год <em>−15%</em></span>
            </button>
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
                <div className="plan-price">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.b key={price} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.28, ease: EASE }}>
                      {fmt(price)}
                    </motion.b>
                  </AnimatePresence>
                  <span>₽/мес</span>
                  <AnimatePresence>
                    {yearly && <motion.em key="save" className="plan-save" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} transition={{ duration: 0.25, ease: EASE }}>−15%</motion.em>}
                  </AnimatePresence>
                </div>
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
  const [active, setActive] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const flow = FLOWS[active];
  const choose = (i) => { setActive(i); setStepIndex(0); };
  const go = (n) => choose((n + FLOWS.length) % FLOWS.length);
  return (
    <section className="section flows" id="flows">
      <div className="container">
        <SectionHead
          center
         
          title={<>Три операции, которые <span className="gradient-text">меняют день</span></>}
          note="Не абстрактная «автоматизация», а конкретные цепочки: смена → табель → зарплата, инцидент → причина → отчёт, месяц → план → факт."
        />
        <div className="flow-carousel">
          <div className="flow-track" role="tablist" aria-label="Сценарии работы">
            {FLOWS.map((f, i) => (
              <button
                key={f.num}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`flow-track__item ${i === active ? 'is-active' : ''}`}
                onClick={() => choose(i)}
              >
                <span className="flow-track__num mono">{f.num}</span>
                <span className="flow-track__chain">{f.chain.join(' → ')}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={flow.num}
              className="flow-slide"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className="flow-story">
                <span className="flow-story__ghost mono" aria-hidden="true">{flow.num}</span>
                <span className="flow-story__label mono">СЦЕНАРИЙ {flow.num}</span>
                <h3>{flow.title}</h3>
                <p>{flow.text}</p>
              </div>
              <div className="flow-stepper">
                <div className="flow-stepper__rail"><span style={{ height: `${((stepIndex + 1) / flow.chain.length) * 100}%` }} /></div>
                {flow.chain.map((c, j) => {
                  const StepIcon = FLOW_ICONS[c];
                  return (
                    <button
                      type="button"
                      key={c}
                      className={`flow-step ${j === stepIndex ? 'is-active' : ''} ${j < stepIndex ? 'is-done' : ''}`}
                      onClick={() => setStepIndex(j)}
                      aria-pressed={j === stepIndex}
                    >
                      <span className="flow-step__dot">{j < stepIndex ? <Check size={14} /> : <span className="mono">0{j + 1}</span>}</span>
                      <span className="flow-step__body">
                        <span className="flow-step__title"><b>{c}</b><StepIcon size={16} /></span>
                        {j === stepIndex && (
                          <motion.span className="flow-step__desc" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: EASE }}>
                            {STEP_DETAILS[c]}
                          </motion.span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flow-nav">
            <button type="button" className="flow-nav__btn" onClick={() => go(active - 1)} aria-label="Предыдущий сценарий"><ChevronLeft size={18} /></button>
            <div className="flow-dots">
              {FLOWS.map((f, i) => (
                <button key={f.num} type="button" className={`flow-dot ${i === active ? 'is-active' : ''}`} onClick={() => choose(i)} aria-label={`Сценарий ${i + 1}`} />
              ))}
            </div>
            <span className="flow-count">{String(active + 1).padStart(2, '0')} / {String(FLOWS.length).padStart(2, '0')}</span>
            <button type="button" className="flow-nav__btn" onClick={() => go(active + 1)} aria-label="Следующий сценарий"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Launch() {
  const [active, setActive] = useState(0);
  const week = WEEKS[active];
  const step = STEPS[active];
  const go = (n) => setActive((n + WEEKS.length) % WEEKS.length);
  return (
    <section className="section section--tint launch" id="launch">
      <div className="container">
        <SectionHead
          center
         
          title={<>Четыре недели <span className="gradient-text">и без Excel</span></>}
          note="Не «внедрение на полгода». Первый месяц — это перенос, настройка и обучение. Дальше система работает вместе с вами."
        />
        <div className="how-carousel">
          <div className="how-track" role="tablist" aria-label="Недели запуска">
            {WEEKS.map((w, i) => (
              <button
                key={w.week}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`how-track__item ${i === active ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="how-track__num mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="how-track__title">{w.title}</span>
                <span className="how-track__time mono">{w.week}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={week.week}
              className="how-slide"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className="how-slide__main">
                <div className="how-slide__meta mono"><span>{week.week.toUpperCase()}</span><span>4 недели</span></div>
                <h3>{week.title}</h3>
                <p>{week.text}</p>
              </div>
              <div className="how-slide__week">
                <span className="how-slide__week-label mono">ШАГ {step.num}</span>
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="how-nav">
            <button type="button" className="how-nav__btn" onClick={() => go(active - 1)} aria-label="Предыдущая неделя"><ChevronLeft size={18} /></button>
            <div className="how-dots">
              {WEEKS.map((w, i) => (
                <button key={w.week} type="button" className={`how-dot ${i === active ? 'is-active' : ''}`} onClick={() => setActive(i)} aria-label={`Неделя ${i + 1}`} />
              ))}
            </div>
            <span className="how-count">{String(active + 1).padStart(2, '0')} / {String(WEEKS.length).padStart(2, '0')}</span>
            <button type="button" className="how-nav__btn" onClick={() => go(active + 1)} aria-label="Следующая неделя"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

const FAQ_GROUPS = [
  { label: 'О сервисе', from: 0, to: 4 },
  { label: 'Процессы и модули', from: 4, to: 8 },
  { label: 'Данные, доступ, цена', from: 8, to: 12 },
  { label: 'Внедрение и демо', from: 12, to: 16 },
];

function Faq() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(0);
  const [open, setOpen] = useState(FAQ_GROUPS[0].from);
  const all = FAQ.map((item, i) => ({ ...item, i }));
  const normalized = query.trim().toLowerCase();
  const group = FAQ_GROUPS[category];
  const items = normalized
    ? all.filter((item) => `${item.q} ${item.a}`.toLowerCase().includes(normalized))
    : all.slice(group.from, group.to);
  const current = items.find((item) => item.i === open) || items[0];
  const pickCategory = (i) => {
    setCategory(i);
    setQuery('');
    setOpen(FAQ_GROUPS[i].from);
  };
  return (
    <section className="section faq" id="faq">
      <div className="container">
        <SectionHead
          center
         
          title={<>Отвечаем на всё, <span className="gradient-text">что спросят</span></>}
          note="Если чего-то не хватает — откройте демо или напишите нам. Отвечаем коротко и по делу."
        />
        <div className="faq-help">
          <div className="faq-tabs" role="tablist" aria-label="Разделы вопросов">
            {FAQ_GROUPS.map((g, i) => (
              <button
                key={g.label}
                type="button"
                role="tab"
                aria-selected={i === category && !normalized}
                className={`faq-tab ${i === category && !normalized ? 'is-active' : ''}`}
                onClick={() => pickCategory(i)}
              >
                <span className="faq-tab__num mono">{String(i + 1).padStart(2, '0')}</span>
                <b>{g.label}</b>
                <em className="mono">{String(g.to - g.from).padStart(2, '0')}</em>
              </button>
            ))}
          </div>
          <div className="faq-panel">
            <div className="faq-search">
              <Search size={17} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Найти ответ на вопрос" aria-label="Поиск по вопросам" />
            </div>
            <div className="faq-panel__body">
              <div className="faq-questions">
                <span className="faq-questions__label mono">{normalized ? 'РЕЗУЛЬТАТЫ ПОИСКА' : group.label.toUpperCase()}</span>
                {items.map((item) => (
                  <button
                    key={item.q}
                    type="button"
                    className={`faq-question ${current?.i === item.i ? 'is-active' : ''}`}
                    onClick={() => setOpen(item.i)}
                  >
                    <span className="faq-question__num mono">{String(item.i + 1).padStart(2, '0')}</span>
                    <span className="faq-question__text">{item.q}</span>
                    <ChevronRight size={16} />
                  </button>
                ))}
                {items.length === 0 && <div className="faq-empty">Ничего не нашли. Попробуйте другой запрос или напишите нам.</div>}
              </div>
              <AnimatePresence mode="wait">
                {current && (
                  <motion.div
                    key={current.i}
                    data-num={String(current.i + 1).padStart(2, '0')}
                    className="faq-answer-panel"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    <span className="faq-answer-panel__label mono">ОТВЕТ · {String(current.i + 1).padStart(2, '0')}</span>
                    <h3>{current.q}</h3>
                    <p>{current.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
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
        <div className="footer-workdo__grid">
          <div className="footer-workdo__brand">
            <Logo />
            <p><span>WorkDo: бизнес под контролем</span>От кадров до финансов: сотрудники, смены, заработная плата и финансы в одной системе.</p>
          </div>
          {groups.map((group) => (
            <div key={group.title}>
              <h4 className="cursor-gradient">{group.title}</h4>
              <ul>
                {group.links.map(([label, href]) => <li key={label}><a href={href}>{label}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-workdo__bottom">
          <p>© 2026 WorkDo. Все права защищены.</p>
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
  useCursorGradient();
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
        <Hero />
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
