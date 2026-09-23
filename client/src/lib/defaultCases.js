export const TRACK_BACKGROUND_OPTIONS = [
  { id: 'asphalt-dark', name: 'Asfalto F1 Nocturno', icon: '🌙' },
  { id: 'asphalt-track', name: 'Asfalto Clásico GP', icon: '🛣️' },
  { id: 'cyber-grid', name: 'Cuadrícula Neón', icon: '⚡' },
  { id: 'wet-track', name: 'Pista Mojada / Lluvia', icon: '🌧️' },
  { id: 'sunset-track', name: 'Atardecer GP', icon: '🌅' }
];

export const DEFAULT_CASES = [
  {
    id: "case-01",
    sector: 1,
    title: "DESAFÍO 1: FLUJO DE INVENTARIO / WMS",
    description: "Una bodega recibe materiales que deben quedar correctamente registrados y disponibles para la operación. El equipo debe identificar cómo gestionar el movimiento dentro del sistema.",
    timeLimitSeconds: 60,
    battleVideoUrl: "/videos/sector-01-battle.mp4",
    battleTitle: "Curva 1: Frenada Extrema a 340 km/h y Adelantamiento por el Vértice Interior",
    battleDescription: "Cámaras on-board a ras de asfalto: las escuderías con recepción de bodega impecable ganan tracción en la primera curva.",
    steps: [
      {
        id: "c1-step-1",
        stepNumber: 1,
        title: "¿Qué es fundamental al recibir un material?",
        description: "El equipo debe definir la acción mandatoria e inmediata al ingreso físico de materiales a bodega.",
        options: [
          { id: "c1-1a", text: "Registrar la recepción/movimiento correspondiente", points: 100, feedback: "¡Telemetría Perfecta! Lo que se mueve físicamente debe quedar trazado en el ERP." },
          { id: "c1-1b", text: "Registrar primero el pago", points: 0, feedback: "Error de procedimiento: El pago no refleja la recepción física del material." },
          { id: "c1-1c", text: "Crear un nuevo proveedor", points: 0, feedback: "Error de datos: El proveedor ya debe existir previamente en el sistema." },
          { id: "c1-1d", text: "Cerrar automáticamente la orden", points: 0, feedback: "Pit stop prematuro: Cerrar la orden antes de tiempo impide la trazabilidad." }
        ]
      },
      {
        id: "c1-step-2",
        stepNumber: 2,
        title: "¿Qué permite registrar correctamente el movimiento?",
        description: "Evaluar el impacto operativo de registrar los movimientos físicos en tiempo real.",
        options: [
          { id: "c1-2a", text: "Mantener trazabilidad de dónde está y qué ocurrió con el material", points: 100, feedback: "¡Pole Position! Visibilidad absoluta de ubicación, estado y disponibilidad." },
          { id: "c1-2b", text: "Eliminar la necesidad de control físico", points: 0, feedback: "Peligro: El control físico y el inventario cíclico siguen siendo necesarios." },
          { id: "c1-2c", text: "Generar automáticamente cualquier compra", points: 0, feedback: "Incorrecto: Los movimientos de bodega no disparan compras descontroladas." },
          { id: "c1-2d", text: "Evitar todas las aprobaciones", points: 0, feedback: "Falta de control: No se deben vulnerar las aprobaciones establecidas." }
        ]
      },
      {
        id: "c1-step-3",
        stepNumber: 3,
        title: "Si un material debe trasladarse entre ubicaciones, ¿qué corresponde?",
        description: "Protocolo del ERP ante traslados internos entre bodegas, patios o áreas de trabajo.",
        options: [
          { id: "c1-3a", text: "Hacer el movimiento correspondiente en el sistema", points: 100, feedback: "¡Excelente! Cada traslado físico requiere su respaldo digital en el ERP." },
          { id: "c1-3b", text: "Modificar manualmente el nombre del producto", points: 0, feedback: "Grave error: Nunca debe alterarse el código o descripción del artículo." },
          { id: "c1-3c", text: "Crear una factura", points: 0, feedback: "Confusión de flujo: Los movimientos entre ubicaciones internas no son facturas." },
          { id: "c1-3d", text: "Eliminar el stock anterior", points: 0, feedback: "Distorsión: Eliminar stock destruye la coherencia de los saldos contables." }
        ]
      },
      {
        id: "c1-step-4",
        stepNumber: 4,
        title: "¿Quién debe ejecutar la operación física de bodega?",
        description: "Gobernanza y segregación de funciones en las operaciones logísticas.",
        options: [
          { id: "c1-4a", text: "Cualquier usuario del ERP", points: 0, feedback: "Riesgo de seguridad: Se requiere rol y capacitación adecuada." },
          { id: "c1-4b", text: "El responsable definido para la operación de bodega", points: 100, feedback: "¡Vuelta Rápida! La segregación de funciones asigna la custodia a su encargado." },
          { id: "c1-4c", text: "El proveedor", points: 0, feedback: "Inadecuado: El proveedor no opera los almacenes de la compañía." },
          { id: "c1-4d", text: "Finanzas", points: 0, feedback: "Finanzas audita y concilia, no efectúa la manipulación física de carga." }
        ]
      },
      {
        id: "c1-step-5",
        stepNumber: 5,
        title: "¿Cuál es el principal objetivo del flujo WMS?",
        description: "Principio rector del sistema de gestión de almacenes en la empresa.",
        options: [
          { id: "c1-5a", text: "Registrar solamente las compras", points: 0, feedback: "WMS gestiona bodegas y stock, no exclusivamente compras." },
          { id: "c1-5b", text: "Tener trazabilidad y control de los movimientos de inventario", points: 100, feedback: "¡Bandera a Cuadros! 'Lo que se mueve físicamente también debe quedar trazado en el ERP.'" },
          { id: "c1-5c", text: "Reemplazar las funciones de Finanzas", points: 0, feedback: "WMS se integra con Finanzas, no reemplaza la contabilidad." },
          { id: "c1-5d", text: "Registrar únicamente los pagos", points: 0, feedback: "Los pagos corresponden al módulo de Cuentas por Pagar." }
        ]
      }
    ]
  },
  {
    id: "case-02",
    sector: 2,
    title: "DESAFÍO 2: COMPRAS Y ABASTECIMIENTO",
    description: "Una operación necesita materiales para continuar trabajando. El equipo debe asegurar que la necesidad se transforme correctamente en una compra y que todo quede trazado en el ERP.",
    timeLimitSeconds: 60,
    battleVideoUrl: "/videos/sector-02-battle.mp4",
    battleTitle: "Chicane de Alta Velocidad: Duelo Rueda a Rueda al Milímetro",
    battleDescription: "Telemetría lateral de cascos: sobrepaso milimétrico en la frenada sin bloqueo de neumáticos.",
    steps: [
      {
        id: "c2-step-1",
        stepNumber: 1,
        title: "Antes de comprar un material, ¿qué es importante verificar?",
        description: "Validación inicial previa a la emisión de compromisos de compra.",
        options: [
          { id: "c2-1a", text: "La necesidad y disponibilidad del material", points: 100, feedback: "¡Telemetría Óptima! Comprar correctamente comienza con una necesidad bien verificada." },
          { id: "c2-1b", text: "Si el proveedor ya emitió una factura", points: 0, feedback: "Incongruente: La factura es posterior al pedido y recepción." },
          { id: "c2-1c", text: "Si Finanzas realizó el pago", points: 0, feedback: "Finanzas no realiza desembolsos sin orden formal de compra." },
          { id: "c2-1d", text: "Si el material ya fue recibido", points: 0, feedback: "No puede recibirse stock sin haber determinado la compra previamente." }
        ]
      },
      {
        id: "c2-step-2",
        stepNumber: 2,
        title: "¿Qué documento formaliza normalmente la compra al proveedor?",
        description: "Identificar el instrumento contractual y transaccional formal en el ERP.",
        options: [
          { id: "c2-2a", text: "Orden de compra", points: 100, feedback: "¡Exacto! La Orden de Compra es el contrato vinculante que formaliza las condiciones." },
          { id: "c2-2b", text: "Orden de venta", points: 0, feedback: "La orden de venta es para pedidos de clientes, no compras." },
          { id: "c2-2c", text: "Ajuste de inventario", points: 0, feedback: "El ajuste sirve para cuadrar diferencias, no formalizar compras." },
          { id: "c2-2d", text: "Nota de crédito", points: 0, feedback: "La nota de crédito documenta devoluciones o rebajas de valor." }
        ]
      },
      {
        id: "c2-step-3",
        stepNumber: 3,
        title: "¿Por qué es importante utilizar correctamente la orden de compra?",
        description: "Fundamento de control y gobierno en el aprovisionamiento de bienes y servicios.",
        options: [
          { id: "c2-3a", text: "Porque permite trazabilidad y control del abastecimiento", points: 100, feedback: "¡Pole Position! Da visibilidad de qué se pidió, a qué precio y fecha de entrega." },
          { id: "c2-3b", text: "Porque reemplaza la recepción física", points: 0, feedback: "La recepción física en bodega sigue siendo indispensable." },
          { id: "c2-3c", text: "Porque aumenta automáticamente el inventario", points: 0, feedback: "El stock aumenta solo cuando se registra la recepción, no con la OC." },
          { id: "c2-3d", text: "Porque reemplaza el pago al proveedor", points: 0, feedback: "La OC no efectúa pagos ni sustituye a Tesorería." }
        ]
      },
      {
        id: "c2-step-4",
        stepNumber: 4,
        title: "¿Qué áreas suelen interactuar en este flujo?",
        description: "Cadena de valor colaborativa del aprovisionamiento en la organización.",
        options: [
          { id: "c2-4a", text: "Solicitante, Compras, Bodega y Finanzas", points: 100, feedback: "¡Sincronización Total! Flujo transversal integrado de punta a punta." },
          { id: "c2-4b", text: "Solamente Finanzas", points: 0, feedback: "Se requiere del área operativa solicitante y de compras." },
          { id: "c2-4c", text: "Solamente Bodega", points: 0, feedback: "Bodega gestiona la custodia física pero no emite la compra." },
          { id: "c2-4d", text: "Solamente el proveedor", points: 0, feedback: "El proveedor es externo; se requiere la interacción de las áreas internas." }
        ]
      },
      {
        id: "c2-step-5",
        stepNumber: 5,
        title: "¿Cuál es el riesgo de despachar físicamente sin registrarlo?",
        description: "Impacto en la confiabilidad de los saldos del inventario de la empresa.",
        options: [
          { id: "c2-5a", text: "Que el ERP muestre inventario que físicamente ya no existe", points: 100, feedback: "¡Bandera a Cuadros! 'Si salió físicamente, su salida también debe existir en el ERP.'" },
          { id: "c2-5b", text: "Que aumente automáticamente el stock", points: 0, feedback: "No aumenta el stock en el sistema." },
          { id: "c2-5c", text: "Que desaparezca el cliente", points: 0, feedback: "El registro del cliente permanece inalterado." },
          { id: "c2-5d", text: "Que se genere otra orden de compra", points: 0, feedback: "Genera inventario fantasma y decisiones de compra erradas." }
        ]
      }
    ]
  },
  {
    id: "case-03",
    sector: 3,
    title: "DESAFÍO 3: FINANZAS / CUENTAS POR PAGAR",
    description: "La empresa recibió materiales de un proveedor y posteriormente recibe su factura. El equipo debe asegurar que lo facturado corresponda a lo comprado y recibido.",
    timeLimitSeconds: 60,
    battleVideoUrl: "/videos/sector-03-battle.mp4",
    battleTitle: "Eau Rouge & Raidillon: Subida a Fondo a 315 km/h Sin Levantar",
    battleDescription: "Cámara de halo en compresión brutal: conciliación impecable permite aceleración máxima en la recta Kemmel.",
    steps: [
      {
        id: "c3-step-1",
        stepNumber: 1,
        title: "Antes de procesar una factura de proveedor, ¿qué es recomendable validar?",
        description: "Regla del 3-Way Match para asegurar la legitimidad del cobro recibido.",
        options: [
          { id: "c3-1a", text: "Compra, recepción y factura", points: 100, feedback: "¡3-Way Match Impecable! Validar qué se pidió, qué se recibió y qué se está cobrando." },
          { id: "c3-1b", text: "Solamente la factura", points: 0, feedback: "Riesgo alto: Pagar sin contrastar genera desembolsos improcedentes." },
          { id: "c3-1c", text: "Solamente el proveedor", points: 0, feedback: "Insuficiente: Conocer al emisor no certifica que el pedido esté completo." },
          { id: "c3-1d", text: "La orden de venta", points: 0, feedback: "La orden de venta pertenece al ciclo de clientes, no de proveedores." }
        ]
      },
      {
        id: "c3-step-2",
        stepNumber: 2,
        title: "La factura indica 100 unidades, pero Bodega recibió 80. ¿Qué corresponde?",
        description: "Resolución de discrepancia entre cantidad facturada y recepción física real.",
        options: [
          { id: "c3-2a", text: "Revisar la diferencia antes de continuar según el procedimiento definido", points: 100, feedback: "¡Precisión Financiera! Jamás procesar pagos en exceso sin aclaración previa." },
          { id: "c3-2b", text: "Cambiar la recepción automáticamente a 100", points: 0, feedback: "Falsedad documental: Inflar la recepción distorsiona el inventario real." },
          { id: "c3-2c", text: "Eliminar la orden de compra", points: 0, feedback: "Eliminar la OC rompe el rastro de auditoría del pedido." },
          { id: "c3-2d", text: "Pagar sin revisar", points: 0, feedback: "Provoca pérdida económica directa e inmediata." }
        ]
      },
      {
        id: "c3-step-3",
        stepNumber: 3,
        title: "¿Por qué es importante relacionar los documentos dentro del ERP?",
        description: "Valor de la trazabilidad documental cruzada en la gestión de compras y pagos.",
        options: [
          { id: "c3-3a", text: "Para mantener trazabilidad desde la compra hasta el pago", points: 100, feedback: "¡Trazabilidad Perfecta! Conexión en cadena: Solicitud -> OC -> Recepción -> Factura -> Pago." },
          { id: "c3-3b", text: "Para evitar registrar recepciones", points: 0, feedback: "Las recepciones son mandatorias para reflejar el ingreso físico." },
          { id: "c3-3c", text: "Para eliminar el control presupuestario", points: 0, feedback: "Al contrario: Refuerza la ejecución presupuestaria exacta." },
          { id: "c3-3d", text: "Para aumentar el inventario", points: 0, feedback: "La relación documental no altera el volumen del stock." }
        ]
      },
      {
        id: "c3-step-4",
        stepNumber: 4,
        title: "¿Quién debería aprobar un pago?",
        description: "Control interno y matriz de autorizaciones bancarias.",
        options: [
          { id: "c3-4a", text: "El responsable definido según las políticas y niveles de autorización", points: 100, feedback: "¡Gobernanza Certificada! Aprobación por niveles de jerarquía y límites financieros." },
          { id: "c3-4b", text: "Cualquier usuario", points: 0, feedback: "Vulnera gravemente el control interno de la tesorería." },
          { id: "c3-4c", text: "El proveedor", points: 0, feedback: "El proveedor cobra, no autoriza transferencias bancarias de la empresa." },
          { id: "c3-4d", text: "Bodega", points: 0, feedback: "Bodega certifica la recepción física, no aprueba desembolsos contables." }
        ]
      },
      {
        id: "c3-step-5",
        stepNumber: 5,
        title: "¿Cuál es un riesgo de pagar sin validar los documentos asociados?",
        description: "Consecuencias de incumplir el proceso de verificación previa al pago.",
        options: [
          { id: "c3-5a", text: "Pagar cantidades, precios o servicios incorrectos", points: 100, feedback: "¡Bandera a Cuadros! 'Antes de pagar, el ERP debe permitir demostrar qué se pidió, qué se recibió y qué se está cobrando.'" },
          { id: "c3-5b", text: "Generar automáticamente más inventario", points: 0, feedback: "El pago bancario no genera inventario físico." },
          { id: "c3-5c", text: "Crear otro proveedor", points: 0, feedback: "No tiene impacto en la creación de proveedores." },
          { id: "c3-5d", text: "Duplicar todos los artículos", points: 0, feedback: "No duplica artículos en el maestro." }
        ]
      }
    ]
  },
  {
    id: "case-04",
    sector: 4,
    title: "DESAFÍO 4: TRAZABILIDAD Y DATOS MAESTROS",
    description: "Un usuario necesita crear rápidamente un artículo porque la operación lo requiere, pero descubre que existe otro artículo con una descripción muy similar.",
    timeLimitSeconds: 60,
    battleVideoUrl: "/videos/sector-04-battle.mp4",
    battleTitle: "Tren de DRS en Recta Principal: Doble Rebase a 355 km/h",
    battleDescription: "Alerón trasero abierto y succión aerodinámica brutal: datos maestros limpios permiten trazabilidad a máxima velocidad.",
    steps: [
      {
        id: "c4-step-1",
        stepNumber: 1,
        title: "¿Qué debería hacer primero?",
        description: "Acción inicial obligatoria antes de ingresar un nuevo código al sistema.",
        options: [
          { id: "c4-1a", text: "Verificar si el artículo ya existe", points: 100, feedback: "¡Excelente! 'Un ERP confiable comienza con datos maestros confiables.' Verificar siempre antes de crear." },
          { id: "c4-1b", text: "Crear inmediatamente uno nuevo", points: 0, feedback: "Peligroso: Genera duplicación inmediata en el maestro." },
          { id: "c4-1c", text: "Utilizar cualquier artículo parecido", points: 0, feedback: "Genera distorsión de costos y desajuste técnico en los repuestos." },
          { id: "c4-1d", text: "Registrar un ajuste de inventario", points: 0, feedback: "El ajuste no resuelve la correcta catalogación del producto." }
        ]
      },
      {
        id: "c4-step-2",
        stepNumber: 2,
        title: "¿Qué problema puede generar duplicar artículos?",
        description: "Impacto operativo y financiero de tener registros duplicados en el maestro.",
        options: [
          { id: "c4-2a", text: "Stock fragmentado, reportes incorrectos y problemas de trazabilidad", points: 100, feedback: "¡Diagnóstico Exacto! La fragmentación oculta el stock real y distorsiona las compras." },
          { id: "c4-2b", text: "Mayor disponibilidad física", points: 0, feedback: "Duplicar un código en el sistema no genera mercadería física." },
          { id: "c4-2c", text: "Pagos más rápidos", points: 0, feedback: "Al contrario: Retrasa la conciliación y los pagos." },
          { id: "c4-2d", text: "Más espacio en la bodega", points: 0, feedback: "No altera la capacidad física de almacenamiento." }
        ]
      },
      {
        id: "c4-step-3",
        stepNumber: 3,
        title: "¿Quién debería modificar información crítica de un maestro?",
        description: "Gobernanza y administración de los datos maestros corporativos.",
        options: [
          { id: "c4-3a", text: "Usuarios autorizados según la gobernanza definida", points: 100, feedback: "¡Gobernanza Blindada! Solo roles con perfil asignado y capacitación." },
          { id: "c4-3b", text: "Cualquier usuario", points: 0, feedback: "Permitir edición abierta arruina la integridad de toda la base de datos." },
          { id: "c4-3c", text: "Cualquier proveedor", points: 0, feedback: "Los proveedores externos no gestionan los maestros internos." },
          { id: "c4-3d", text: "Todos los clientes", points: 0, feedback: "Los clientes no tienen acceso administrativo al ERP." }
        ]
      },
      {
        id: "c4-step-4",
        stepNumber: 4,
        title: "Si un artículo cambia de descripción, ¿qué debería evitarse?",
        description: "Buenas prácticas de actualización y ciclo de vida de artículos.",
        options: [
          { id: "c4-4a", text: "Crear otro código innecesariamente si sigue siendo el mismo artículo", points: 100, feedback: "¡Exacto! Si es el mismo bien, se actualizan sus atributos oficiales." },
          { id: "c4-4b", text: "Actualizar información autorizada", points: 0, feedback: "Actualizar con autorización es el procedimiento correcto." },
          { id: "c4-4c", text: "Informar el cambio", points: 0, feedback: "Informar a las áreas es necesario y recomendado." },
          { id: "c4-4d", text: "Revisar su clasificación", points: 0, feedback: "Revisar la clasificación periódicamente es una buena práctica." }
        ]
      },
      {
        id: "c4-step-5",
        stepNumber: 5,
        title: "¿Por qué son importantes los datos maestros?",
        description: "Impacto transversal de los catálogos maestros en el rendimiento de la organización.",
        options: [
          { id: "c4-5a", text: "Porque afectan múltiples procesos y reportes del ERP", points: 100, feedback: "¡Bandera a Cuadros! Un maestro limpio asegura compras, stock, costos y balances confiables." },
          { id: "c4-5b", text: "Porque solo sirven para visualizar nombres", points: 0, feedback: "Falso: Determinan cuentas contables, impuestos, unidades y precios." },
          { id: "c4-5c", text: "Porque solo los utiliza Finanzas", points: 0, feedback: "Los datos maestros son compartidos por todas las áreas de la empresa." },
          { id: "c4-5d", text: "Porque no afectan las transacciones", points: 0, feedback: "Impactan directamente cada orden, recepción y factura emitida." }
        ]
      }
    ]
  },
  {
    id: "case-05",
    sector: 5,
    title: "DESAFÍO 5: EL ERROR QUE NADIE DEBE COMETER",
    description: "Son las 17:50. Bodega necesita despachar urgentemente un material, pero el movimiento todavía no está autorizado en el ERP. Alguien propone: 'Despachémoslo ahora y mañana arreglamos el sistema'.",
    timeLimitSeconds: 60,
    battleVideoUrl: "/videos/sector-05-battle.mp4",
    battleTitle: "Horquilla de 180°: Frenada Tardía y Tijera Perfecta (Switchback)",
    battleDescription: "Frenada al límite en la horquilla: la disciplina operativa define el campeonato en los momentos de mayor presión.",
    steps: [
      {
        id: "c5-step-1",
        stepNumber: 1,
        title: "¿Qué riesgo genera esta decisión?",
        description: "Consecuencias de autorizar salidas físicas sin el debido registro en el ERP.",
        options: [
          { id: "c5-1a", text: "Diferencias entre inventario físico y ERP", points: 100, feedback: "¡Alerta Crítica! La urgencia no elimina la necesidad de trazabilidad." },
          { id: "c5-1b", text: "Ninguno, porque mañana se puede corregir", points: 0, feedback: "Falso: Casi nunca se regulariza fielmente y se pierde el control." },
          { id: "c5-1c", text: "Solamente cambia la fecha", points: 0, feedback: "Genera discrepancias en costos, inventarios y cierres contables." },
          { id: "c5-1d", text: "El ERP lo detectará y corregirá automáticamente", points: 0, feedback: "El sistema no puede deducir movimientos realizados fuera de él." }
        ]
      },
      {
        id: "c5-step-2",
        stepNumber: 2,
        title: "¿Qué principio se está rompiendo?",
        description: "Identificar el principio operativo vulnerado al actuar al margen del sistema.",
        options: [
          { id: "c5-2a", text: "La trazabilidad de la operación", points: 100, feedback: "¡Correcto! Se quiebra el puente entre la realidad física y la contabilidad digital." },
          { id: "c5-2b", text: "La creación de proveedores", points: 0, feedback: "No guarda relación con la creación de proveedores." },
          { id: "c5-2c", text: "La facturación del cliente", points: 0, feedback: "Es un problema directo de trazabilidad operativa y física." },
          { id: "c5-2d", text: "El cierre contable exclusivamente", points: 0, feedback: "Afecta a toda la cadena de abastecimiento y custodia de activos." }
        ]
      },
      {
        id: "c5-step-3",
        stepNumber: 3,
        title: "Si existe una urgencia real, ¿qué corresponde?",
        description: "Protocolo formal de gestión de urgencias y excepciones operativas.",
        options: [
          { id: "c5-3a", text: "Seguir el procedimiento de excepción/autorización definido por la organización", points: 100, feedback: "¡Pole Position! 'La urgencia puede cambiar la prioridad; no debería eliminar el control.'" },
          { id: "c5-3b", text: "Saltarse el ERP", points: 0, feedback: "Prohibido: Desmantela los controles y la auditoría interna." },
          { id: "c5-3c", text: "Compartir la contraseña de un aprobador", points: 0, feedback: "Infracción grave de ciberseguridad y políticas corporativas." },
          { id: "c5-3d", text: "Registrar información ficticia", points: 0, feedback: "Constituye adulteración deliberada de registros de la empresa." }
        ]
      },
      {
        id: "c5-step-4",
        stepNumber: 4,
        title: "¿Qué NO debería hacerse?",
        description: "Conductas prohibidas que dañan irreparablemente la trazabilidad del negocio.",
        options: [
          { id: "c5-4a", text: "Manipular registros para hacer coincidir posteriormente el sistema", points: 100, feedback: "¡Regla de Oro! Manipular registros destruye la confianza y la validez ante auditorías." },
          { id: "c5-4b", text: "Documentar la excepción", points: 0, feedback: "Documentar la excepción es obligatorio y correcto." },
          { id: "c5-4c", text: "Solicitar autorización", points: 0, feedback: "Solicitar autorización por los canales formales es lo esperado." },
          { id: "c5-4d", text: "Registrar correctamente el movimiento", points: 0, feedback: "Registrar con fidelidad es el estándar exigido." }
        ]
      },
      {
        id: "c5-step-5",
        stepNumber: 5,
        title: "¿Cuál es la mejor regla práctica?",
        description: "Máxima de campeonato para la gestión diaria de operaciones y logística.",
        options: [
          { id: "c5-5a", text: "La urgencia no elimina la necesidad de trazabilidad", points: 100, feedback: "¡Bandera a Cuadros! Un equipo de campeonato mantiene la disciplina y el control bajo presión." },
          { id: "c5-5b", text: "Si es urgente, el ERP es opcional", points: 0, feedback: "El ERP nunca es opcional en una gestión profesional." },
          { id: "c5-5c", text: "Primero se mueve y después se pregunta", points: 0, feedback: "Conduce directamente a quiebres de stock y pérdidas millonarias." },
          { id: "c5-5d", text: "Bodega no necesita controles", points: 0, feedback: "Bodega custodia los activos de mayor valor de la empresa." }
        ]
      }
    ]
  },
  {
    id: "case-06",
    sector: 6,
    title: "DESAFÍO 6: INGRESOS",
    description: "El área Comercial ha adjudicado un nuevo contrato y ya se cuenta con la formalización correspondiente por parte del cliente. El equipo debe gestionar correctamente la creación y seguimiento de la Orden de Venta, asegurando su integración con los procesos internos.",
    timeLimitSeconds: 60,
    battleVideoUrl: "/videos/sector-01-battle.mp4",
    battleTitle: "Doble Rebase en Curva Rápida: Máxima Potencia y Sincronización",
    battleDescription: "Gestión de contratos impecable: aceleración limpia en los ingresos comerciales del equipo.",
    steps: [
      {
        id: "c6-step-1",
        stepNumber: 1,
        title: "¿Qué documento puede dar origen a una Orden de Venta?",
        description: "Documentos formales que respaldan el inicio del ciclo de ingresos comerciales.",
        options: [
          { id: "c6-1a", text: "Contrato", points: 0, feedback: "Parcialmente correcto, pero no es la única opción válida." },
          { id: "c6-1b", text: "HES", points: 0, feedback: "Parcialmente correcto, pero no es la única opción válida." },
          { id: "c6-1c", text: "Estado de Pago", points: 0, feedback: "El Estado de Pago corresponde al proceso posterior de cobranza." },
          { id: "c6-1d", text: "Solo A y B", points: 100, feedback: "¡Excelente! Tanto el Contrato como la HES pueden dar origen formal a la Orden de Venta." }
        ]
      },
      {
        id: "c6-step-2",
        stepNumber: 2,
        title: "¿Qué información es fundamental para crear correctamente una Orden de Venta?",
        description: "Dato maestro primordial para la imputación presupuestaria y contable del negocio.",
        options: [
          { id: "c6-2a", text: "Oportunidad", points: 0, feedback: "La oportunidad es una fase preliminar del embudo comercial." },
          { id: "c6-2b", text: "Estimación", points: 0, feedback: "La estimación es una cotización previa." },
          { id: "c6-2c", text: "Centro de Costo", points: 100, feedback: "¡Fundamental! El Centro de Costo asegura la correcta estructura e imputación de ingresos y gastos." },
          { id: "c6-2d", text: "Proveedor", points: 0, feedback: "El proveedor corresponde al módulo de compras, no de ingresos comerciales." }
        ]
      },
      {
        id: "c6-step-3",
        stepNumber: 3,
        title: "¿Cuál es la estructura de negocio asociada al Centro de Costo?",
        description: "Dimensiones y niveles que integran el Centro de Costo en la plataforma.",
        options: [
          { id: "c6-3a", text: "Subsidiaria", points: 0, feedback: "Forma parte del Centro de Costo, pero no es el único elemento." },
          { id: "c6-3b", text: "Línea de Negocio y Sublínea de Negocio", points: 0, feedback: "Forma parte del Centro de Costo, pero no es el único elemento." },
          { id: "c6-3c", text: "Cliente y Faena", points: 0, feedback: "Forma parte del Centro de Costo, pero no es el único elemento." },
          { id: "c6-3d", text: "Todas las anteriores", points: 100, feedback: "¡Estructura Completa! Subsidiaria, Línea/Sublínea, Cliente y Faena componen el Centro de Costo." }
        ]
      },
      {
        id: "c6-step-4",
        stepNumber: 4,
        title: "¿Qué tipo de seguimiento se puede realizar desde la Orden de Venta?",
        description: "Métricas y dimensiones de control accesibles desde la Orden de Venta.",
        options: [
          { id: "c6-4a", text: "Consumo de cartera y cantidades", points: 0, feedback: "Es una dimensión relevante pero no la única." },
          { id: "c6-4b", text: "Consumo de cartera y costos", points: 0, feedback: "Es una dimensión relevante pero no la única." },
          { id: "c6-4c", text: "Análisis de costos de proveedores", points: 0, feedback: "Es una dimensión relevante pero no la única." },
          { id: "c6-4d", text: "Todas las anteriores", points: 100, feedback: "¡Visión 360°! Permite controlar cartera, cantidades, costos asociados y proveedores." }
        ]
      },
      {
        id: "c6-step-5",
        stepNumber: 5,
        title: "Ante un nuevo alcance solicitado por el cliente, ¿cómo se debe proceder?",
        description: "Protocolo de gobernanza ante modificaciones y ampliaciones de alcance contractual.",
        options: [
          { id: "c6-5a", text: "Modificar directamente las partidas en INCOME", points: 0, feedback: "Riesgoso: Salta la gobernanza del ERP central." },
          { id: "c6-5b", text: "Cargar únicamente los documentos en NetSuite", points: 0, feedback: "Insuficiente: No sincroniza el nuevo alcance con el sistema comercial." },
          { id: "c6-5c", text: "Solicitar al área de Backoffice la modificación correspondiente en NetSuite para su posterior integración con INCOME", points: 100, feedback: "¡Flujo Óptimo de Gobernanza! Asegura la consistencia entre NetSuite e INCOME de manera auditada." },
          { id: "c6-5d", text: "Ejecutar primero el nuevo alcance y regularizar posteriormente el servicio", points: 0, feedback: "Peligro: Trabajo ejecutado sin orden corre el riesgo de no ser pagado." }
        ]
      }
    ]
  }
];
