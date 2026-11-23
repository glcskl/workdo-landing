import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight, ChartNoAxesCombined, Clock, Database, FileSpreadsheet, FileText,
  KeyRound, Layers, MapPin, Shield, ShieldAlert, ShieldCheck, Users, X, Menu,
} from 'lucide-react';
import { STATS, FEATURES, ADVANTAGES, TRUST, FOOTER_GROUPS } from './data.js';

const ICONS = {
  Users, MapPin, Clock, ShieldAlert, ChartNoAxesCombined, Shield,
  Layers, ShieldCheck, FileSpreadsheet, Database, FileText, KeyRound,
};

const EASE = [0.16, 1, 0.3, 1];
const REGISTER = '/workdo-landing/register/';
const LOGIN = '/workdo-landing/register/#login';

function Icon({ name, size = 32 }) {
  const C = ICONS[name] || Layers;
  return <C size={size} strokeWidth={1.8} />;
}

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

function Reveal({ children, delay = 0, y = 24, className = '', as = 'div', ...rest }) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px -8% 0px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

function Counter({ to, prefix = '', suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 1300, 1);
      setValue(Math.round(to * (1 - Math.pow(1 - p, 4))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, to]);

  return <span ref={ref}>{prefix}{value.toLocaleString('ru-RU')}{suffix}</span>;
}

function Logo({ footer = false }) {
  return <a className={`logo ${footer ? 'logo--footer' : ''}`} href="#top">WorkDo</a>;
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? window.scrollY / h : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />
      <motion.header
        className={`site-header ${scrolled ? 'is-scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div className="header-inner container">
          <Logo />
          <div className="header-actions">
            <a className="header-login" href={LOGIN}>Войти</a>
            <a className="btn btn-dark" href={REGISTER}>
              <span className="btn-full">Начать бесплатно</span>
              <span className="btn-short">Начать</span>
              <ArrowRight size={16} />
            </a>
            <button className="menu-toggle" onClick={() => setMenu(!menu)} aria-label={menu ? 'Закрыть меню' : 'Открыть меню'}>
              {menu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {menu && (
          <nav className="mobile-nav">
            <a href={LOGIN} onClick={() => setMenu(false)}>Войти</a>
            <a href={REGISTER} onClick={() => setMenu(false)}>Начать бесплатно</a>
          </nav>
        )}
      </motion.header>
    </>
  );
}

function GradientText({ children }) {
  return <span className="cursor-gradient">{children}</span>;
}

function InkText({ children }) {
  return <span className="ink-gradient">{children}</span>;
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-glow hero-glow--blue" />
      <div className="hero-glow hero-glow--green" />
      <div className="container hero-inner">
        <Reveal className="badge" y={10}>
          <span className="badge-dot" />Система управления бизнесом
        </Reveal>
        <h1>
          <Reveal as="span" className="line"><InkText>WorkDo:</InkText></Reveal>
          <br />
          <Reveal as="span" className="line" delay={0.1}><GradientText>бизнес под контролем</GradientText></Reveal>
        </h1>
        <Reveal as="p" className="hero-sub" y={24} delay={0.16}>
          От кадров до финансов: сотрудники, смены, заработная плата и финансы в одной системе. Отраслевые модули настраиваются под ваш бизнес.
        </Reveal>
        <Reveal className="hero-cta" y={20} delay={0.24}>
          <a className="btn btn-dark" href={REGISTER}>Начать бесплатно <ArrowRight size={17} /></a>
        </Reveal>
      </div>
      <div className="scroll-mouse" aria-hidden="true"><span /></div>
    </section>
  );
}

function Stats() {
  return (
    <section className="section section--tint" id="system">
      <div className="container">
        <Reveal className="head-center">
          <div className="eyebrow">Система в цифрах</div>
          <h2 className="section-title">
            <GradientText>Решение</GradientText> <InkText>более 150-ти</InkText>
            <br />
            <span className="text-ink">вызовов и проблем</span> <GradientText>вашего бизнеса</GradientText>
          </h2>
        </Reveal>
        <div className="stat-grid">
          {STATS.map((stat, i) => (
            <Reveal as="a" href={stat.href} className="stat" key={stat.label} delay={i * 0.07} y={20}>
              <div className="stat-value"><Counter to={stat.value} prefix={stat.prefix} suffix={stat.suffix} /></div>
              <div className="stat-label">{stat.label}</div>
              {stat.desc && <div className="stat-desc">{stat.desc}</div>}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="section section--white" id="features">
      <div className="container">
        <Reveal className="head-center">
          <div className="eyebrow">Возможности</div>
          <h2 className="section-title">
            <InkText>Всё для управления</InkText>
            <br />
            <GradientText>бизнесом</GradientText> <span className="text-ink">в одном окне</span>
          </h2>
        </Reveal>
        <div className="card-grid card-grid--3">
          {FEATURES.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 0.06} y={15}>
              <a className="card card--light" href="#features">
                <Icon name={item.icon} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span className="card-meta">{item.meta}<span className="card-more">Подробнее <ArrowRight size={14} /></span></span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Advantages() {
  return (
    <section className="section section--dark" id="advantages">
      <div className="container">
        <Reveal className="head-center">
          <div className="eyebrow eyebrow--dark">Преимущества</div>
          <h2 className="section-title section-title--light">
            <span className="white-gradient">Почему выбирают</span>
            <br />
            <GradientText>WorkDo</GradientText>
          </h2>
        </Reveal>
        <div className="card-grid card-grid--3">
          {ADVANTAGES.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 0.06} y={20}>
              <a className="card card--dark" href="#advantages">
                <span className="icon-well"><Icon name={item.icon} size={20} /></span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span className="card-more">Подробнее <ArrowRight size={14} /></span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="section section--tint" id="trust">
      <div className="container">
        <Reveal className="head-center">
          <div className="eyebrow">Безопасность данных</div>
          <h2 className="section-title">
            <GradientText>Надёжность,</GradientText> <span className="text-ink">которой можно доверять</span>
          </h2>
        </Reveal>
        <div className="card-grid card-grid--4">
          {TRUST.map((item, i) => (
            <Reveal key={item.title} delay={(i % 4) * 0.06} y={15}>
              <a className="card card--light" href="#trust">
                <Icon name={item.icon} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span className="card-meta">{item.meta}<span className="card-more">Подробнее <ArrowRight size={14} /></span></span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="section section--dark section--pricing" id="pricing">
      <div className="container center">
        <div className="eyebrow eyebrow--dark">Тарифы</div>
        <h2 className="section-title section-title--light price-title"><GradientText>Прозрачные цены.</GradientText></h2>
        <p className="section-note">Весь функционал доступен на любом тарифе. Разница только в количестве сотрудников.</p>
        <Reveal className="price" y={24}>
          от 1 740 <span>₽/мес</span>
        </Reveal>
        <div className="price-more">
          <a href="/workdo-landing/pricing/">Подробнее о тарифах <ArrowRight size={16} /></a>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="section section--dark section--cta">
      <div className="cta-glow" />
      <div className="container center relative">
        <Reveal as="h2" className="cta-title" y={20}>
          <GradientText>Подключите</GradientText> <GradientText>WorkDo</GradientText>
        </Reveal>
        <p className="cta-note">WorkDo уже работает в реальном бизнесе. Покажем, как всё устроено, настроим систему под процессы вашей компании и откроем тестовый доступ. Бесплатно.</p>
        <a className="btn btn-light" href={REGISTER}>Попробовать бесплатно <ArrowRight size={17} /></a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo footer />
            <p><span>WorkDo: бизнес под контролем</span>От кадров до финансов: сотрудники, смены, заработная плата и финансы в одной системе.</p>
          </div>
          {FOOTER_GROUPS.map((group) => (
            <div className="footer-col" key={group.title}>
              <h5 className="cursor-gradient">{group.title}</h5>
              <ul>
                {group.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="footer-link">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p>© 2026 WorkDo. Все права защищены.</p>
          <div className="footer-contacts">
            <a href="mailto:info@workdo.ru">info@workdo.ru</a>
            <span>|</span>
            <a href="tel:+375297184884">+375 (29) 718-48-84</a>
            <span>|</span>
            <a href="tel:+79009904504">+7 (900) 990-45-04</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  useCursorGradient();
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <Stats />
        <Features />
        <Advantages />
        <Trust />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
