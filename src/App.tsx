import { useState } from "react";
import type { Dispatch, ReactElement, SetStateAction, SVGProps } from "react";
import "./App.css";

type Screen = "summary" | "detail" | "tips";
type HeaderType = "menu" | "back";
type Period = "Hoy" | "7 días" | "30 días";

type IconName =
    | "menu"
    | "bell"
    | "back"
    | "help"
    | "home"
    | "bars"
    | "bulb"
    | "battery"
    | "clock"
    | "check"
    | "plug"
    | "sun"
    | "grid"
    | "chevron"
    | "leaf";

type RecommendationColor = "green" | "yellow" | "blue";

const ENERGY = 78;


interface DetailPeriodData {
    value: number;
    battery: number;
    autonomy: string;
    time: string;
    description: string;
    chartAreaPath: string;
    chartLinePath: string;
    pointX: number;
    pointY: number;
    sources: {
        solar: string;
        batteries: string;
        grid: string;
    };
}

const DETAIL_PERIOD_DATA: Record<Period, DetailPeriodData> = {
    Hoy: {
        value: 78,
        battery: 78,
        autonomy: "3 h 45 min",
        time: "10:30 AM",
        description:
            "Vista diaria: muestra la disponibilidad estimada para el día actual y el último punto actualizado.",
        chartAreaPath:
            "M20 78 C42 86 50 55 72 58 C95 62 96 94 121 96 C145 98 151 123 177 116 C200 110 196 90 225 91 C253 92 255 74 282 62 L282 138 L20 138 Z",
        chartLinePath:
            "M20 78 C42 86 50 55 72 58 C95 62 96 94 121 96 C145 98 151 123 177 116 C200 110 196 90 225 91 C253 92 255 74 282 62",
        pointX: 282,
        pointY: 62,
        sources: {
            solar: "65%",
            batteries: "30%",
            grid: "5%",
        },
    },
    "7 días": {
        value: 72,
        battery: 72,
        autonomy: "3 h 20 min",
        time: "Promedio semanal",
        description:
            "Vista semanal: compara los últimos 7 días y ayuda a detectar variaciones de consumo recurrentes.",
        chartAreaPath:
            "M20 92 C48 78 61 70 86 76 C112 82 119 58 146 66 C173 74 170 104 198 108 C224 112 230 84 253 78 C270 74 274 82 282 82 L282 138 L20 138 Z",
        chartLinePath:
            "M20 92 C48 78 61 70 86 76 C112 82 119 58 146 66 C173 74 170 104 198 108 C224 112 230 84 253 78 C270 74 274 82 282 82",
        pointX: 282,
        pointY: 82,
        sources: {
            solar: "58%",
            batteries: "35%",
            grid: "7%",
        },
    },
    "30 días": {
        value: 81,
        battery: 81,
        autonomy: "4 h 05 min",
        time: "Promedio mensual",
        description:
            "Vista mensual: resume los últimos 30 días para evaluar estabilidad, autonomía y aporte de cada fuente.",
        chartAreaPath:
            "M20 84 C44 76 55 68 80 70 C111 73 112 92 143 88 C174 84 180 60 210 62 C238 64 238 86 260 78 C274 73 276 64 282 56 L282 138 L20 138 Z",
        chartLinePath:
            "M20 84 C44 76 55 68 80 70 C111 73 112 92 143 88 C174 84 180 60 210 62 C238 64 238 86 260 78 C274 73 276 64 282 56",
        pointX: 282,
        pointY: 56,
        sources: {
            solar: "62%",
            batteries: "28%",
            grid: "10%",
        },
    },
};

interface RecommendationData {
    icon: Extract<IconName, "plug" | "clock" | "battery">;
    color: RecommendationColor;
    title: string;
    text: string;
    details: string[];
}

const RECOMMENDATIONS: RecommendationData[] = [
    {
        icon: "plug",
        color: "green",
        title: "Usa dispositivos esenciales",
        text: "Prioriza iluminación, refrigerador, carga de dispositivos y ventilación.",
        details: [
            "Mantén conectados solo los equipos necesarios para seguridad, comunicación y conservación de alimentos.",
            "Apaga televisores, consolas, hornos eléctricos o equipos secundarios mientras la autonomía sea limitada.",
        ],
    },
    {
        icon: "clock",
        color: "yellow",
        title: "Evita consumos altos en horas pico",
        text: "Usa equipos de alto consumo entre 10:00 AM y 4:00 PM si es posible.",
        details: [
            "Programa lavadora, plancha, bomba de agua o herramientas cuando exista mayor aporte solar.",
            "Evita encender varios equipos de alto consumo al mismo tiempo para no acelerar la descarga.",
        ],
    },
    {
        icon: "battery",
        color: "blue",
        title: "Cuida el nivel de batería",
        text: "Si baja de 30%, enfócate en lo indispensable.",
        details: [
            "Reduce iluminación no esencial y desconecta cargadores o equipos en espera.",
            "Si el sistema marca batería baja, conserva energía para refrigeración, comunicación y ventilación básica.",
        ],
    },
];

interface IconProps {
    name: IconName;
    size?: number;
}

function Icon({ name, size = 24 }: IconProps): ReactElement {
    const common: SVGProps<SVGSVGElement> = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
    };

    const icons: Record<IconName, ReactElement> = {
        menu: (
            <svg {...common}>
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
        ),
        bell: (
            <svg {...common}>
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
        ),
        back: (
            <svg {...common}>
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
            </svg>
        ),
        help: (
            <svg {...common}>
                <circle cx="12" cy="12" r="10" />
                <path d="M9.1 9a3 3 0 1 1 5.8 1c-.7 1.5-2.9 1.7-2.9 3.5" />
                <path d="M12 17h.01" />
            </svg>
        ),
        home: (
            <svg {...common}>
                <path d="M3 11l9-8 9 8" />
                <path d="M5 10v10h14V10" />
                <path d="M9 20v-6h6v6" />
            </svg>
        ),
        bars: (
            <svg {...common}>
                <path d="M5 20V10" />
                <path d="M12 20V4" />
                <path d="M19 20v-7" />
            </svg>
        ),
        bulb: (
            <svg {...common}>
                <path d="M9 18h6" />
                <path d="M10 22h4" />
                <path d="M8 14a6 6 0 1 1 8 0c-.8.7-1 1.5-1 2H9c0-.5-.2-1.3-1-2z" />
            </svg>
        ),
        battery: (
            <svg {...common}>
                <rect x="7" y="3" width="10" height="18" rx="2" />
                <path d="M10 3V1h4v2" />
                <path d="M10 12h4" />
                <path d="M12 10v4" />
            </svg>
        ),
        clock: (
            <svg {...common}>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v6l4 2" />
            </svg>
        ),
        check: (
            <svg {...common}>
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12.5l2.5 2.5L16 9" />
            </svg>
        ),
        plug: (
            <svg {...common}>
                <path d="M9 2v7" />
                <path d="M15 2v7" />
                <path d="M7 9h10v4a5 5 0 0 1-10 0V9z" />
                <path d="M12 18v4" />
            </svg>
        ),
        sun: (
            <svg {...common}>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="M4.93 4.93l1.41 1.41" />
                <path d="M17.66 17.66l1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="M4.93 19.07l1.41-1.41" />
                <path d="M17.66 6.34l1.41-1.41" />
            </svg>
        ),
        grid: (
            <svg {...common}>
                <path d="M4 4h6v6H4z" />
                <path d="M14 4h6v6h-6z" />
                <path d="M4 14h6v6H4z" />
                <path d="M14 14h6v6h-6z" />
            </svg>
        ),
        chevron: (
            <svg {...common}>
                <path d="M9 18l6-6-6-6" />
            </svg>
        ),
        leaf: (
            <svg {...common}>
                <path d="M5 21c8-2 13-8 14-18C9 4 4 9 5 21z" />
                <path d="M5 21c4-7 8-10 14-18" />
            </svg>
        ),
    };

    return icons[name];
}

function App(): ReactElement {
    const [screen, setScreen] = useState<Screen>("summary");
    const [period, setPeriod] = useState<Period>("Hoy");

    return (
        <main className="page">
            <section className="phone">
                {screen === "summary" && <SummaryScreen onNavigate={setScreen} />}

                {screen === "detail" && (
                    <DetailScreen period={period} setPeriod={setPeriod} onNavigate={setScreen} />
                )}

                {screen === "tips" && <TipsScreen onNavigate={setScreen} />}

                <BottomNavigation active={screen} onChange={setScreen} />
            </section>
        </main>
    );
}

interface HeaderProps {
    title: string;
    type?: HeaderType;
    onLeftClick?: () => void;
    onRightClick?: () => void;
    leftLabel?: string;
    rightLabel?: string;
}

function Header({
                    title,
                    type = "menu",
                    onLeftClick,
                    onRightClick,
                    leftLabel = "Menú",
                    rightLabel = "Ayuda",
                }: HeaderProps): ReactElement {
    return (
        <header className="app-header">
            <button
                className="header-btn"
                type="button"
                aria-label={leftLabel}
                onClick={onLeftClick}
            >
                <Icon name={type === "back" ? "back" : "menu"} />
            </button>

            <h1>{title}</h1>

            <button
                className="header-btn"
                type="button"
                aria-label={rightLabel}
                onClick={onRightClick}
            >
                <Icon name={type === "back" ? "help" : "bell"} />
            </button>
        </header>
    );
}

interface SummaryScreenProps {
    onNavigate: Dispatch<SetStateAction<Screen>>;
}

function SummaryScreen({ onNavigate }: SummaryScreenProps): ReactElement {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [lastUpdate, setLastUpdate] = useState("10:30 AM");
    const [summaryMessage, setSummaryMessage] = useState(
        "Datos actualizados desde el sistema."
    );

    const refreshSummary = (): void => {
        const now = new Date().toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
        });

        setLastUpdate(now);
        setSummaryMessage("Datos actualizados manualmente desde el menú de resumen.");
        setIsMenuOpen(false);
    };

    const goTo = (nextScreen: Screen): void => {
        setIsMenuOpen(false);
        onNavigate(nextScreen);
    };

    return (
        <>
            <Header
                title="Mi energía"
                leftLabel="Abrir menú de resumen"
                onLeftClick={() => setIsMenuOpen(true)}
            />

            <div className="screen-content">
                <div className="status-row">
          <span className="online-pill">
            <span />
            En línea
          </span>

                    <p>Última actualización: {lastUpdate}</p>
                </div>

                <section
                    className="card main-card clickable-card"
                    role="button"
                    tabIndex={0}
                    aria-label="Abrir detalle de energía"
                    onClick={() => goTo("detail")}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            goTo("detail");
                        }
                    }}
                >
                    <h2>Disponibilidad energética</h2>

                    <div className="gauge-wrap">
                        <div className="gauge">
                            <div className="gauge-value">
                                <strong>{ENERGY}</strong>
                                <span>%</span>
                            </div>
                        </div>
                    </div>

                    <p className="energy-label">Energía disponible</p>

                    <span className="good-pill">Estado: Bueno</span>
                </section>

                <div className="metrics-grid">
                    <article className="metric-card">
                        <div className="metric-icon battery">
                            <Icon name="battery" size={28} />
                        </div>

                        <div>
                            <p>Nivel de batería</p>
                            <strong>78%</strong>
                        </div>
                    </article>

                    <article className="metric-card">
                        <div className="metric-icon clock">
                            <Icon name="clock" size={30} />
                        </div>

                        <div>
                            <p>Autonomía estimada</p>
                            <strong>3 h 45 min</strong>
                        </div>
                    </article>
                </div>

                <section
                    className="success-card clickable-card"
                    role="button"
                    tabIndex={0}
                    aria-label="Abrir recomendaciones de uso"
                    onClick={() => goTo("tips")}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            goTo("tips");
                        }
                    }}
                >
                    <div className="success-icon">
                        <Icon name="check" />
                    </div>

                    <div>
                        <h3>Tu sistema tiene buena disponibilidad de energía.</h3>
                        <p>Puedes usar tus dispositivos con normalidad.</p>
                    </div>
                </section>

                <section className="info-block">
                    <h3>Información de los datos</h3>

                    <div className="cloud-row">
                        <div className="cloud-icon" />
                        <div>
                            <p>{summaryMessage}</p>
                            <p>Se mostrarán datos locales si no hay conexión.</p>
                        </div>
                    </div>
                </section>
            </div>

            {isMenuOpen && (
                <SummaryMenu
                    onClose={() => setIsMenuOpen(false)}
                    onRefresh={refreshSummary}
                    onGoToDetail={() => goTo("detail")}
                    onGoToTips={() => goTo("tips")}
                />
            )}
        </>
    );
}

interface SummaryMenuProps {
    onClose: () => void;
    onRefresh: () => void;
    onGoToDetail: () => void;
    onGoToTips: () => void;
}

function SummaryMenu({
                         onClose,
                         onRefresh,
                         onGoToDetail,
                         onGoToTips,
                     }: SummaryMenuProps): ReactElement {
    return (
        <div className="summary-menu-backdrop" onClick={onClose}>
            <aside
                className="summary-menu-panel"
                aria-label="Menú de resumen"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="summary-menu-head">
                    <h2>Acciones rápidas</h2>
                    <button type="button" onClick={onClose} aria-label="Cerrar menú">
                        ×
                    </button>
                </div>

                <button type="button" className="summary-menu-option" onClick={onRefresh}>
                    <Icon name="bell" size={22} />
                    <span>
              <strong>Actualizar datos</strong>
              <small>Refresca hora y estado local.</small>
            </span>
                </button>

                <button type="button" className="summary-menu-option" onClick={onGoToDetail}>
                    <Icon name="bars" size={22} />
                    <span>
              <strong>Ver detalle</strong>
              <small>Consulta Hoy, 7 días y 30 días.</small>
            </span>
                </button>

                <button type="button" className="summary-menu-option" onClick={onGoToTips}>
                    <Icon name="bulb" size={22} />
                    <span>
              <strong>Consejos de uso</strong>
              <small>Abre las recomendaciones básicas.</small>
            </span>
                </button>
            </aside>
        </div>
    );
}

interface DetailScreenProps {
    period: Period;
    setPeriod: Dispatch<SetStateAction<Period>>;
    onNavigate: Dispatch<SetStateAction<Screen>>;
}

function DetailScreen({
                          period,
                          setPeriod,
                          onNavigate,
                      }: DetailScreenProps): ReactElement {
    const periods: Period[] = ["Hoy", "7 días", "30 días"];
    const detailData = DETAIL_PERIOD_DATA[period];

    return (
        <>
            <Header
                title="Detalle de energía"
                type="back"
                leftLabel="Volver al resumen"
                onLeftClick={() => onNavigate("summary")}
            />

            <div className="tabs">
                {periods.map((item) => (
                    <button
                        key={item}
                        type="button"
                        className={period === item ? "active" : ""}
                        onClick={() => setPeriod(item)}
                        aria-pressed={period === item}
                    >
                        {item}
                    </button>
                ))}
            </div>

            <div className="screen-content detail-content">
                <section className="card period-insight-card">
                    <strong>{period}</strong>
                    <p>{detailData.description}</p>
                </section>

                <section className="card chart-card">
                    <h2>Disponibilidad a lo largo del día</h2>

                    <div className="chart-area">
                        <div className="chart-labels">
                            <span>100%</span>
                            <span>75%</span>
                            <span>50%</span>
                            <span>25%</span>
                            <span>0%</span>
                        </div>

                        <svg className="energy-chart" viewBox="0 0 300 160">
                            <defs>
                                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#0c8f2d" stopOpacity="0.26" />
                                    <stop offset="100%" stopColor="#0c8f2d" stopOpacity="0.04" />
                                </linearGradient>
                            </defs>

                            <line x1="20" y1="15" x2="20" y2="138" className="axis" />
                            <line x1="282" y1="138" x2="282" y2="15" className="axis" />

                            <path d={detailData.chartAreaPath} className="area" />
                            <path d={detailData.chartLinePath} className="line" />
                            <circle
                                cx={detailData.pointX}
                                cy={detailData.pointY}
                                r="6"
                                className="point"
                            />
                        </svg>

                        <div className="tooltip">
                            <strong>{detailData.value}%</strong>
                            <span>{detailData.time}</span>
                        </div>
                    </div>

                    <div className="chart-times">
                        <span>00:00</span>
                        <span>06:00</span>
                        <span>12:00</span>
                        <span>18:00</span>
                        <span>24:00</span>
                    </div>
                </section>

                <section className="card battery-card">
                    <div className="battery-head">
                        <h2>Nivel de batería</h2>
                        <strong>{detailData.battery}%</strong>
                    </div>

                    <div className="progress-track">
                        <div style={{ width: `${detailData.battery}%` }} />
                    </div>

                    <div className="system-row">
                        <span>Autonomía estimada</span>
                        <strong>{detailData.autonomy}</strong>
                    </div>

                    <div className="system-row compact-row">
                        <span>Estado del sistema</span>
                        <span className="normal-pill">Normal</span>
                    </div>
                </section>

                <section className="card source-card">
                    <h2>¿De dónde viene la energía?</h2>

                    <EnergySource icon="sun" label="Solar (Sistema 1)" value={detailData.sources.solar} />
                    <EnergySource icon="battery" label="Baterías" value={detailData.sources.batteries} />
                    <EnergySource icon="grid" label="Red eléctrica" value={detailData.sources.grid} />
                </section>
            </div>
        </>
    );
}

interface EnergySourceProps {
    icon: Extract<IconName, "sun" | "battery" | "grid">;
    label: string;
    value: string;
}

function EnergySource({
                          icon,
                          label,
                          value,
                      }: EnergySourceProps): ReactElement {
    return (
        <div className="source-row">
            <div className={`source-icon ${icon}`}>
                <Icon name={icon} size={24} />
            </div>

            <span>{label}</span>

            <strong>{value}</strong>
        </div>
    );
}

interface TipsScreenProps {
    onNavigate: Dispatch<SetStateAction<Screen>>;
}

function TipsScreen({ onNavigate }: TipsScreenProps): ReactElement {
    const [openRecommendation, setOpenRecommendation] = useState<number | null>(0);

    return (
        <>
            <Header
                title="Consejos para tu hogar"
                type="back"
                leftLabel="Volver al resumen"
                onLeftClick={() => onNavigate("summary")}
            />

            <div className="screen-content tips-content">
                <section className="congrats-card">
                    <div className="leaf-circle">
                        <Icon name="leaf" size={44} />
                    </div>

                    <div>
                        <h2>¡Buen trabajo!</h2>
                        <p>
                            Tu disponibilidad energética es buena. Sigue estos consejos para
                            mantener tu energía por más tiempo.
                        </p>
                    </div>
                </section>

                <section>
                    <h3 className="section-title">Recomendaciones básicas</h3>

                    <div className="recommendation-list">
                        {RECOMMENDATIONS.map((recommendation, index) => (
                            <Recommendation
                                key={recommendation.title}
                                {...recommendation}
                                isOpen={openRecommendation === index}
                                onToggle={() =>
                                    setOpenRecommendation((current) =>
                                        current === index ? null : index
                                    )
                                }
                            />
                        ))}
                    </div>
                </section>

                <section className="tip-card">
                    <div className="tip-icon">
                        <Icon name="bulb" />
                    </div>

                    <div>
                        <h3>¿Sabías que?</h3>
                        <p>
                            Pequeñas acciones diarias ayudan a mantener la energía disponible
                            para tu hogar.
                        </p>
                    </div>
                </section>
            </div>
        </>
    );
}

interface RecommendationProps extends RecommendationData {
    isOpen: boolean;
    onToggle: () => void;
}

function Recommendation({
                            icon,
                            color,
                            title,
                            text,
                            details,
                            isOpen,
                            onToggle,
                        }: RecommendationProps): ReactElement {
    return (
        <article className={isOpen ? "recommendation-card open" : "recommendation-card"}>
            <button
                type="button"
                className="recommendation"
                onClick={onToggle}
                aria-expanded={isOpen}
            >
                <div className={`recommendation-icon ${color}`}>
                    <Icon name={icon} />
                </div>

                <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                </div>

                <span className="chevron-wrap">
            <Icon name="chevron" size={22} />
          </span>
            </button>

            {isOpen && (
                <div className="recommendation-detail">
                    <strong>Descripción recomendada</strong>
                    <ul>
                        {details.map((detail) => (
                            <li key={detail}>{detail}</li>
                        ))}
                    </ul>
                </div>
            )}
        </article>
    );
}

interface BottomNavigationProps {
    active: Screen;
    onChange: Dispatch<SetStateAction<Screen>>;
}

interface BottomNavItem {
    id: Screen;
    label: string;
    icon: Extract<IconName, "home" | "bars" | "bulb">;
}

function BottomNavigation({
                              active,
                              onChange,
                          }: BottomNavigationProps): ReactElement {
    const items: BottomNavItem[] = [
        { id: "summary", label: "Resumen", icon: "home" },
        { id: "detail", label: "Detalle", icon: "bars" },
        { id: "tips", label: "Consejos", icon: "bulb" },
    ];

    return (
        <nav className="bottom-nav">
            {items.map((item) => (
                <button
                    key={item.id}
                    type="button"
                    className={active === item.id ? "active" : ""}
                    onClick={() => onChange(item.id)}
                >
                    <Icon name={item.icon} size={25} />
                    <span>{item.label}</span>
                </button>
            ))}
        </nav>
    );
}

export default App;