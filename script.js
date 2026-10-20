
// ==========================================
// LUMINA ESTÉTICA — JAVASCRIPT
// ETAPA 4: FUNCIONALIDADES AVANÇADAS
// ==========================================


// ==========================================
// 01 — CONFIGURAÇÕES
// ==========================================

// Número de WhatsApp de uma empresa real.
// Exemplo de formato: 55 + DDD + telefone.
// Deixe vazio no projeto demonstrativo.

const WHATSAPP_NUMBER = "";


// Preferência do usuário por animações.

const allowsMotion = window.matchMedia(
    "(prefers-reduced-motion: no-preference)"
).matches;


// ==========================================
// 02 — ANO AUTOMÁTICO
// ==========================================

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


// ==========================================
// 03 — FILTROS DOS TRATAMENTOS
// ==========================================

const filterButtons = document.querySelectorAll(
    ".filter-button"
);

const treatmentCards = document.querySelectorAll(
    ".treatment-card"
);

const filterFeedback = document.getElementById(
    "filter-feedback"
);


// Aplica o filtro selecionado.

function applyFilter(category) {

    let visibleCount = 0;

    treatmentCards.forEach((card) => {

        const cardCategory = card.dataset.category;

        const shouldShow =
            category === "all" ||
            cardCategory === category;

        // Mostra ou esconde o cartão.
        card.hidden = !shouldShow;

        if (shouldShow) {
            visibleCount++;
        }

    });


    // Atualiza a aparência dos botões.

    filterButtons.forEach((button) => {

        const isActive =
            button.dataset.filter === category;

        button.classList.toggle(
            "is-active",
            isActive
        );

        button.setAttribute(
            "aria-pressed",
            String(isActive)
        );

    });


    // Atualiza o contador.

    if (filterFeedback) {

        filterFeedback.textContent =
            `Exibindo ${visibleCount} ` +
            `${visibleCount === 1
                ? "tratamento"
                : "tratamentos"}.`;

    }

}


// Eventos dos botões.

filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const category = button.dataset.filter;

        applyFilter(category);

    });

});


// ==========================================
// 04 — PERGUNTAS FREQUENTES
// ==========================================

const faqItems = document.querySelectorAll(
    ".faq-item"
);


// Permite manter apenas uma pergunta aberta.

faqItems.forEach((item) => {

    item.addEventListener("toggle", () => {

        if (!item.open) return;

        faqItems.forEach((otherItem) => {

            if (otherItem !== item) {
                otherItem.open = false;
            }

        });

    });

});


// ==========================================
// 05 — FORMULÁRIO DE AGENDAMENTO
// ==========================================

const bookingForm = document.getElementById(
    "booking-form"
);

const nameInput = document.getElementById(
    "booking-name"
);

const serviceSelect = document.getElementById(
    "booking-service"
);

const dateInput = document.getElementById(
    "booking-date"
);

const periodSelect = document.getElementById(
    "booking-period"
);

const bookingResult = document.getElementById(
    "booking-result"
);

const bookingStatus = document.getElementById(
    "booking-status"
);

const bookingMessage = document.getElementById(
    "booking-message"
);


// ==========================================
// 06 — DATA MÍNIMA
// ==========================================

// Retorna a data atual no horário local,
// no formato YYYY-MM-DD.

function getTodayISO() {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// Impede a escolha de datas anteriores a hoje.

if (dateInput) {
    dateInput.min = getTodayISO();
}


// ==========================================
// 07 — SELEÇÃO AUTOMÁTICA DE TRATAMENTO
// ==========================================

const treatmentLinks = document.querySelectorAll(
    ".treatment-select"
);

treatmentLinks.forEach((link) => {

    link.addEventListener("click", () => {

        const selectedService = link.dataset.service;

        if (!serviceSelect) return;

        // Seleciona o serviço no formulário.
        serviceSelect.value = selectedService;

        // Limpa um resultado de agendamento antigo.
        if (bookingResult) {
            bookingResult.hidden = true;
        }

        // O próprio href="#contato" levará
        // o visitante para o formulário.

    });

});


// ==========================================
// 08 — VALIDAÇÃO E ENVIO
// ==========================================

if (
    bookingForm &&
    nameInput &&
    serviceSelect &&
    dateInput &&
    periodSelect &&
    bookingResult &&
    bookingStatus &&
    bookingMessage
) {

    // Limpa mensagens personalizadas de erro.

    nameInput.addEventListener("input", () => {
        nameInput.setCustomValidity("");
    });

    dateInput.addEventListener("input", () => {
        dateInput.setCustomValidity("");
    });


    bookingForm.addEventListener("submit", (event) => {

        // Impede o envio tradicional da página.
        event.preventDefault();

        // Atualiza a data mínima.
        dateInput.min = getTodayISO();

        // Validação nativa do HTML.
        if (!bookingForm.reportValidity()) {
            return;
        }


        // Obtém os valores preenchidos.

        const customerName =
            nameInput.value.trim().replace(/\s+/g, " ");

        const treatment = serviceSelect.value;

        const selectedDate = dateInput.value;

        const selectedPeriod = periodSelect.value;


        // Validação de nome.
        if (customerName.length < 2) {

            nameInput.setCustomValidity(
                "Informe um nome com pelo menos 2 caracteres."
            );

            nameInput.reportValidity();

            return;
        }


        // Validação de data.
        if (selectedDate < getTodayISO()) {

            dateInput.setCustomValidity(
                "Selecione uma data atual ou futura."
            );

            dateInput.reportValidity();

            return;
        }


        // Converte YYYY-MM-DD para DD/MM/YYYY.

        const [year, month, day] =
            selectedDate.split("-");

        const formattedDate =
            `${day}/${month}/${year}`;


        // ==================================
        // 09 — CRIAÇÃO DA MENSAGEM
        // ==================================

        const message = [
            "Olá! Gostaria de consultar um agendamento na Lumina Estética.",
            "",
            `Nome: ${customerName}`,
            `Tratamento: ${treatment}`,
            `Data desejada: ${formattedDate}`,
            `Período preferido: ${selectedPeriod}`,
            "",
            "Poderiam me informar a disponibilidade?"
        ].join("\n");


        // Exibe a mensagem gerada.

        bookingMessage.value = message;

        bookingResult.hidden = false;


        // ==================================
        // 10 — WHATSAPP
        // ==================================

        // Valida o formato do telefone brasileiro.
        const validNumber = /^55\d{10,11}$/.test(
            WHATSAPP_NUMBER
        );

        if (validNumber) {

            const encodedMessage =
                encodeURIComponent(message);

            const whatsappURL =
                `https://wa.me/${WHATSAPP_NUMBER}` +
                `?text=${encodedMessage}`;

            // Abre a conversa com mensagem preenchida.
            const openedWindow = window.open(
                whatsappURL,
                "_blank",
                "noopener,noreferrer"
            );

            // Alguns navegadores retornam null
            // mesmo quando a nova aba foi aberta.
            bookingStatus.textContent =
                "Tentamos abrir o WhatsApp com sua " +
                "mensagem preenchida. Caso não tenha " +
                "aberto, copie a mensagem abaixo. " +
                "O agendamento só será solicitado " +
                "quando você enviar a mensagem.";

        } else {

            // Modo de demonstração.
            bookingStatus.textContent =
                "Este é um projeto demonstrativo. " +
                "Nenhuma solicitação foi enviada. " +
                "Confira abaixo a mensagem que seria " +
                "preparada para o estabelecimento.";

        }


        // Mostra o resultado na tela.

        bookingResult.scrollIntoView({
            behavior: allowsMotion
                ? "smooth"
                : "auto",
            block: "nearest"
        });

    });

}


// ==========================================
// 11 — COPIAR MENSAGEM
// ==========================================

const copyButton = document.getElementById(
    "copy-booking"
);

const copyStatus = document.getElementById(
    "copy-status"
);

if (copyButton && bookingMessage && copyStatus) {

    copyButton.addEventListener("click", async () => {

        const text = bookingMessage.value;

        if (!text) return;

        try {

            if (!navigator.clipboard) {
                throw new Error("Clipboard indisponível");
            }

            await navigator.clipboard.writeText(text);

            copyStatus.textContent =
                "Mensagem copiada com sucesso!";

        } catch (error) {

            // Alternativa para navegadores
            // sem acesso ao clipboard.

            bookingMessage.focus();
            bookingMessage.select();

            copyStatus.textContent =
                "Texto selecionado. Pressione Ctrl + C " +
                "para copiar a mensagem.";

        }

    });

}


// ==========================================
// 12 — ANIMAÇÕES DE ROLAGEM
// ==========================================

const animatedElements = document.querySelectorAll(
    "[data-reveal]"
);

const supportsObserver =
    "IntersectionObserver" in window;

if (allowsMotion && supportsObserver) {

    const observer = new IntersectionObserver(
        (entries, currentObserver) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "is-visible"
                    );

                    currentObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -25px 0px"
        }
    );

    animatedElements.forEach((element) => {

        element.classList.add("reveal-ready");

        observer.observe(element);

    });

}


// ==========================================
// ETAPA 5 — MENU RESPONSIVO
// ==========================================

const menuButton = document.querySelector(
    ".menu-toggle"
);

const mainNavigation = document.getElementById(
    "main-navigation"
);

if (menuButton && mainNavigation) {

    // Habilita o comportamento controlado por JS.
    document.documentElement.classList.add(
        "js-enabled"
    );

    // Fecha o menu e atualiza a acessibilidade.
    function closeMobileMenu() {

        mainNavigation.classList.remove("is-open");

        menuButton.classList.remove("is-active");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        menuButton.setAttribute(
            "aria-label",
            "Abrir menu"
        );
    }


    // Abrir e fechar ao clicar.

    menuButton.addEventListener("click", () => {

        const isOpen =
            mainNavigation.classList.toggle("is-open");

        menuButton.classList.toggle(
            "is-active",
            isOpen
        );

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Fechar menu" : "Abrir menu"
        );

    });


    // Fecha ao clicar em qualquer link.

    mainNavigation.querySelectorAll("a").forEach(
        (link) => {

            link.addEventListener(
                "click",
                closeMobileMenu
            );

        }
    );


    // Fecha com a tecla Escape.

    document.addEventListener("keydown", (event) => {

        if (
            event.key === "Escape" &&
            mainNavigation.classList.contains("is-open")
        ) {

            closeMobileMenu();
            menuButton.focus();

        }

    });


    // Fecha ao clicar fora do cabeçalho.

    document.addEventListener("click", (event) => {

        const header = document.querySelector(".header");

        if (
            header &&
            !header.contains(event.target) &&
            mainNavigation.classList.contains("is-open")
        ) {
            closeMobileMenu();
        }

    });


    // Reorganiza ao voltar para o computador.

    window.addEventListener("resize", () => {

        if (window.innerWidth > 1024) {
            closeMobileMenu();
        }

    });

}


// ==========================================
// ETAPA 5 — ATUALIZAÇÃO DO CALENDÁRIO
// ==========================================

if (dateInput) {

    const updateMinimumDate = () => {
        dateInput.min = getTodayISO();
    };

    dateInput.addEventListener(
        "focus",
        updateMinimumDate
    );

    dateInput.addEventListener(
        "click",
        updateMinimumDate
    );

}

