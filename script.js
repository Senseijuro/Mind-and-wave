// Global Variables
let isMenuOpen = false
let currentModal = null
let activeDropdown = null

// Function declaration for trackEvent
function trackEvent(eventType, eventData) {
  console.log(`Event tracked: ${eventType} - ${eventData}`)
}

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

// Initialize Application
function initializeApp() {
  setupEventListeners()
  setupNavbarScroll()
  setupParallaxEffect()
  initializeBackToTop()
  initializeHeroLogo() // Added logo initialization
  console.log("🎉 Mind & Wave - Site Web chargé avec succès!")
}

// Setup Event Listeners
function setupEventListeners() {
  // Search functionality
  const searchBtn = document.querySelector(".search-icon-btn")

  if (searchBtn) {
    searchBtn.addEventListener("click", performSearch)
  }

  // Modal close on outside click
  window.addEventListener("click", (event) => {
    const contactModal = document.getElementById("contactModal")
    const rdvModal = document.getElementById("rdvModal")

    if (event.target === contactModal) {
      closeModal("contactModal")
    }
    if (event.target === rdvModal) {
      closeModal("rdvModal")
    }

    // Close dropdowns when clicking outside
    if (!event.target.closest(".dropdown")) {
      closeAllDropdowns()
    }
  })

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Close modals with Escape key
    if (e.key === "Escape" && currentModal) {
      closeModal(currentModal)
    }

    // Close dropdowns with Escape
    if (e.key === "Escape") {
      closeAllDropdowns()
    }

    // Search with Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault()
      performSearch()
    }

    // Close mobile menu with Escape
    if (e.key === "Escape" && isMenuOpen) {
      closeMobileMenu()
    }
  })

  // Form submissions
  const contactForm = document.getElementById("contactForm")
  const rdvForm = document.getElementById("rdvForm")
  const mainContactForm = document.getElementById("mainContactForm")

  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmission)
  }

  if (rdvForm) {
    rdvForm.addEventListener("submit", handleRdvSubmission)
  }

  if (mainContactForm) {
    mainContactForm.addEventListener("submit", handleMainContactSubmission)
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        scrollToSection(target.getAttribute("href").substring(1))
      }
    })
  })

  // Newsletter subscription
  const newsletterForm = document.querySelector(".newsletter-form")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault()
      subscribeNewsletter()
    })
  }

  // Close mobile menu when clicking on links
  document.querySelectorAll(".nav-btn").forEach((link) => {
    link.addEventListener("click", closeMobileMenu)
  })

  // Form input enhancements
  setupFormEnhancements()
}

// Navbar Scroll Effect
function setupNavbarScroll() {
  let ticking = false

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleNavbarScroll()
        handleBackToTopVisibility()
        ticking = false
      })
      ticking = true
    }
  })
}

function handleNavbarScroll() {
  const navbar = document.getElementById("navbar")
  if (!navbar) return

  const scrolled = window.pageYOffset

  // Ajouter la classe 'scrolled' après 20px de scroll
  if (scrolled > 20) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }
}

// Parallax Effect
function setupParallaxEffect() {
  let ticking = false

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleParallaxScroll()
        ticking = false
      })
      ticking = true
    }
  })
}

function handleParallaxScroll() {
  const hero = document.querySelector(".hero")
  if (!hero) return

  const scrolled = window.pageYOffset
  const heroHeight = hero.offsetHeight
  const scrollPercent = scrolled / heroHeight

  // Appliquer l'effet parallax seulement si on est dans la section hero
  if (scrollPercent <= 1) {
    const translateY = scrolled * 0.5
    hero.style.setProperty("--parallax-offset", `${translateY}px`)

    // Mettre à jour le transform de l'image de fond
    const heroBackground = hero.querySelector("::before")
    if (heroBackground) {
      hero.style.setProperty("--bg-transform", `translateY(${translateY}px)`)
    }
  }
}

// Dropdown Management
function toggleDropdown(button) {
  const dropdown = button.closest(".dropdown")
  const isCurrentlyActive = dropdown.classList.contains("active")

  // Close all dropdowns first
  closeAllDropdowns()

  // If this dropdown wasn't active, open it
  if (!isCurrentlyActive) {
    dropdown.classList.add("active")
    activeDropdown = dropdown

    // Add click outside listener
    setTimeout(() => {
      document.addEventListener("click", handleDropdownOutsideClick)
    }, 0)
  }
}

function closeAllDropdowns() {
  const dropdowns = document.querySelectorAll(".dropdown.active")
  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove("active")
  })
  activeDropdown = null
  document.removeEventListener("click", handleDropdownOutsideClick)
}

function handleDropdownOutsideClick(event) {
  if (activeDropdown && !activeDropdown.contains(event.target)) {
    closeAllDropdowns()
  }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")
  const navActions = document.querySelector(".nav-actions")

  isMenuOpen = !isMenuOpen

  if (hamburger) hamburger.classList.toggle("active")
  if (navMenu) navMenu.classList.toggle("active")
  if (navActions) navActions.classList.toggle("active")

  // Prevent body scroll when menu is open
  document.body.style.overflow = isMenuOpen ? "hidden" : ""

  // Add/remove backdrop
  if (isMenuOpen) {
    createMobileMenuBackdrop()
  } else {
    removeMobileMenuBackdrop()
  }
}

// Close mobile menu
function closeMobileMenu() {
  if (isMenuOpen) {
    toggleMobileMenu()
  }
}

// Create mobile menu backdrop
function createMobileMenuBackdrop() {
  const backdrop = document.createElement("div")
  backdrop.className = "mobile-menu-backdrop"
  backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 999;
        opacity: 0;
        transition: opacity 0.3s ease;
    `

  document.body.appendChild(backdrop)

  // Fade in
  setTimeout(() => {
    backdrop.style.opacity = "1"
  }, 10)

  // Close menu when clicking backdrop
  backdrop.addEventListener("click", closeMobileMenu)
}

// Remove mobile menu backdrop
function removeMobileMenuBackdrop() {
  const backdrop = document.querySelector(".mobile-menu-backdrop")
  if (backdrop) {
    backdrop.style.opacity = "0"
    setTimeout(() => {
      if (backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop)
      }
    }, 300)
  }
}

// Search functionality
function performSearch() {
  const searchTerm = prompt("Que recherchez-vous ?")

  if (!searchTerm || !searchTerm.trim()) {
    return
  }

  const term = searchTerm.trim()

  if (term.length < 2) {
    showNotification("Le terme de recherche doit contenir au moins 2 caractères.", "warning")
    return
  }

  // Show loading
  showLoading()

  // Simulate search delay
  setTimeout(() => {
    hideLoading()

    // Simulate search results
    const searchResults = simulateSearch(term)

    if (searchResults.length > 0) {
      const resultsText = searchResults.map((result) => `• ${result}`).join("\n")
      showNotification(
        `🔍 Résultats pour "${term}" :\n\n${resultsText}\n\n💡 Contactez-nous pour plus d'informations !`,
        "success",
        "Résultats de recherche",
      )
    } else {
      showNotification(
        `❌ Aucun résultat trouvé pour "${term}"\n\n💡 Essayez avec d'autres mots-clés ou contactez-nous directement !`,
        "info",
        "Aucun résultat",
      )
    }
  }, 1000)
}

// Simulate search results
function simulateSearch(term) {
  const searchData = [
    { keywords: ["gestion", "management", "manager", "qvct"], result: "Gestion et Management" },
    { keywords: ["commerce", "commercial", "négociation", "marketing"], result: "Commerce et Relation Client" },
    { keywords: ["conseil", "jeune", "finance", "fiscalité", "immobilier"], result: "Conseil Jeune" },
    { keywords: ["formation", "accompagnement", "développement"], result: "Formation et Développement" },
    { keywords: ["audit", "conformité", "légal", "social"], result: "Audit et Conformité" },
    { keywords: ["recrutement", "recruter", "embauche", "candidat"], result: "Recrutement et Sélection" },
  ]

  const results = []
  const lowerTerm = term.toLowerCase()

  searchData.forEach((item) => {
    if (item.keywords.some((keyword) => keyword.includes(lowerTerm) || lowerTerm.includes(keyword))) {
      results.push(item.result)
    }
  })

  return results
}

// Smooth scrolling to sections
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    const offsetTop = element.offsetTop - 70
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    })
  }
  closeMobileMenu()
  closeAllDropdowns()
}

// Scroll to top function
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

// Show service information
function showServiceInfo(service) {
  const services = {
    gestion: {
      title: "GESTION ET MANAGEMENT",
      icon: "📊",
      description:
        "Notre service de gestion et management vous aide à optimiser vos processus et développer vos compétences managériales.",
      details: [
        "🎯 Qualité de Vie et Conditions de Travail (QVCT)",
        "👨‍💼 Formation 'Être Manager'",
        "⚖️ Législation Sociale",
        "💰 Analyse des comptes d'exploitation",
        "📈 Optimisation des processus",
        "🤝 Accompagnement au changement",
      ],
    },
    commerce: {
      title: "COMMERCE ET RELATION CLIENT",
      icon: "🤝",
      description: "Développez vos compétences commerciales et optimisez votre relation client.",
      details: [
        "💬 Techniques de Communication",
        "🎯 Négociation Commerciale",
        "📊 Stratégies Marketing",
        "📋 Gestion de Projet",
        "🔄 Fidélisation client",
        "📈 Développement commercial",
      ],
    },
    conseil: {
      title: "CONSEIL JEUNE",
      icon: "🎓",
      description: "Accompagnement spécialisé pour les jeunes professionnels et entrepreneurs.",
      details: [
        "💰 Conseil en Finance",
        "📊 Optimisation Fiscale",
        "🏠 Investissement Immobilier",
        "🎯 Orientation Professionnelle",
        "💼 Création d'entreprise",
        "📈 Stratégie de développement",
      ],
    },
  }

  const serviceData = services[service]
  if (serviceData) {
    const detailsHtml = serviceData.details.map((detail) => `${detail}`).join("\n")
    const message = `${serviceData.icon} ${serviceData.title}\n\n${serviceData.description}\n\n📋 NOS PRESTATIONS :\n${detailsHtml}\n\n💡 Contactez-nous pour un devis personnalisé !`

    showNotification(message, "info", serviceData.title)
  }

  closeAllDropdowns()
}

// Show general information
function showInfo(type) {
  const infos = {
    actualites: "Consultez régulièrement notre blog pour les dernières actualités RH !",
    instagram: "Suivez-nous sur Instagram pour nos actualités visuelles !",
    facebook: "Rejoignez notre communauté Facebook !",
    linkedin: "Suivez-nous sur LinkedIn pour nos actualités professionnelles !",
    twitter: "Retrouvez-nous sur Twitter pour nos conseils RH quotidiens !",
    youtube: "Découvrez nos webinaires sur notre chaîne YouTube !",
    mentions: "Mentions légales disponibles sur demande.",
    confidentialite: "Politique de confidentialité conforme au RGPD.",
    cookies: "Gestion des cookies dans les paramètres de votre navigateur.",
    cgv: "Conditions générales disponibles sur demande.",
    carrieres: "Rejoignez notre équipe ! Consultez nos offres d'emploi.",
    partenaires: "Découvrez nos partenaires de confiance.",
  }

  const info = infos[type]
  if (info) {
    showNotification(info, "info")
  } else {
    showNotification("Information non disponible pour le moment.", "warning")
  }

  closeAllDropdowns()
}

// Newsletter subscription
function subscribeNewsletter() {
  const emailInput = document.getElementById("newsletterEmail")
  if (!emailInput) return

  const email = emailInput.value.trim()

  if (!email) {
    showNotification("Veuillez saisir votre adresse email.", "warning")
    return
  }

  if (!isValidEmail(email)) {
    showNotification("Veuillez saisir une adresse email valide.", "error")
    return
  }

  showLoading()

  // Simulate subscription
  setTimeout(() => {
    hideLoading()
    showNotification(
      `✅ Inscription réussie !\n\nMerci de vous être inscrit à notre newsletter avec l'adresse ${email}.\n\n📧 Vous recevrez nos actualités RH et conseils.`,
      "success",
      "Newsletter",
    )
    emailInput.value = ""
  }, 1000)
}

// Modal functions
function openContactModal() {
  currentModal = "contactModal"
  const modal = document.getElementById("contactModal")
  if (modal) {
    modal.style.display = "block"
    document.body.style.overflow = "hidden"

    // Focus on first input
    setTimeout(() => {
      const firstInput = document.getElementById("contactName")
      if (firstInput) firstInput.focus()
    }, 100)

    // Track modal opening
    trackEvent("modal_opened", "contact")
  }
}

function openRdvModal() {
  currentModal = "rdvModal"
  const modal = document.getElementById("rdvModal")
  if (modal) {
    modal.style.display = "block"
    document.body.style.overflow = "hidden"

    // Focus on first input
    setTimeout(() => {
      const firstInput = document.getElementById("rdvName")
      if (firstInput) firstInput.focus()
    }, 100)

    // Track modal opening
    trackEvent("modal_opened", "rdv")
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.style.display = "none"
    document.body.style.overflow = ""
    currentModal = null

    // Reset form if exists
    const form = modal.querySelector("form")
    if (form) {
      form.reset()
      clearFormErrors(form)
    }

    // Track modal closing
    trackEvent("modal_closed", modalId)
  }
}

// Form handling
function handleContactSubmission(e) {
  e.preventDefault()

  const name = document.getElementById("contactName").value
  const email = document.getElementById("contactEmail").value
  const message = document.getElementById("contactMessage").value

  if (!name || !email || !message) {
    showNotification("Veuillez remplir tous les champs obligatoires.", "error")
    return
  }

  if (!isValidEmail(email)) {
    showNotification("Veuillez saisir une adresse email valide.", "error")
    return
  }

  showLoading()

  setTimeout(() => {
    hideLoading()
    showNotification(
      `✅ Message envoyé avec succès !\n\nMerci ${name} !\n\nNous vous répondrons à ${email} dans les plus brefs délais.`,
      "success",
      "Message envoyé",
    )
    closeModal("contactModal")
  }, 1500)
}

function handleRdvSubmission(e) {
  e.preventDefault()

  const name = document.getElementById("rdvName").value
  const email = document.getElementById("rdvEmail").value
  const date = document.getElementById("rdvDate").value

  if (!name || !email || !date) {
    showNotification("Veuillez remplir tous les champs obligatoires.", "error")
    return
  }

  if (!isValidEmail(email)) {
    showNotification("Veuillez saisir une adresse email valide.", "error")
    return
  }

  const selectedDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (selectedDate < today) {
    showNotification("La date ne peut pas être dans le passé.", "error")
    return
  }

  showLoading()

  setTimeout(() => {
    hideLoading()
    showNotification(
      `✅ Rendez-vous confirmé !\n\nMerci ${name} !\n\n📅 Date : ${formatDate(date)}\n📧 Confirmation envoyée à ${email}`,
      "success",
      "Rendez-vous confirmé",
    )
    closeModal("rdvModal")
  }, 1500)
}

function handleMainContactSubmission(e) {
  e.preventDefault()

  const firstName = document.getElementById("firstName").value
  const lastName = document.getElementById("lastName").value
  const email = document.getElementById("email").value
  const subject = document.getElementById("subject").value
  const message = document.getElementById("message").value

  if (!firstName || !lastName || !email || !subject || !message) {
    showNotification("Veuillez remplir tous les champs obligatoires.", "error")
    return
  }

  if (!isValidEmail(email)) {
    showNotification("Veuillez saisir une adresse email valide.", "error")
    return
  }

  showLoading()

  setTimeout(() => {
    hideLoading()
    showNotification(
      `✅ Message envoyé avec succès !\n\nMerci ${firstName} ${lastName} !\n\nNous vous répondrons à ${email} dans les plus brefs délais concernant : ${getSubjectLabel(subject)}`,
      "success",
      "Message envoyé",
    )

    // Reset form
    document.getElementById("mainContactForm").reset()
  }, 1500)
}

// Utility functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function clearFormErrors(form) {
  if (!form) return

  // Reset field borders and shadows
  const fields = form.querySelectorAll("input, select, textarea")
  fields.forEach((field) => {
    field.style.borderColor = ""
    field.style.boxShadow = ""
  })

  // Remove error messages
  const errorMessages = form.querySelectorAll(".error-message")
  errorMessages.forEach((error) => error.remove())
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function getSubjectLabel(value) {
  const subjects = {
    gestion: "Gestion et Management",
    commerce: "Commerce et Relation Client",
    conseil: "Conseil Jeune",
    autre: "Autre demande",
  }
  return subjects[value] || value
}

// Form enhancements
function setupFormEnhancements() {
  // Real-time email validation
  document.querySelectorAll('input[type="email"]').forEach((input) => {
    input.addEventListener("blur", function () {
      if (this.value && !isValidEmail(this.value)) {
        this.style.borderColor = "#dc3545"
        showNotification("Format d'email invalide", "error")
      } else if (this.value) {
        this.style.borderColor = "#ff6b6b"
      }
    })

    input.addEventListener("input", function () {
      if (this.style.borderColor === "rgb(220, 53, 69)") {
        this.style.borderColor = ""
      }
    })
  })

  // Character counter for textareas
  document.querySelectorAll("textarea").forEach((textarea) => {
    const maxLength = textarea.getAttribute("maxlength") || 500

    const counter = document.createElement("div")
    counter.className = "char-counter"
    counter.style.cssText = `
            text-align: right;
            font-size: 12px;
            color: #cccccc;
            margin-top: 5px;
        `

    textarea.parentNode.appendChild(counter)

    function updateCounter() {
      const remaining = maxLength - textarea.value.length
      counter.textContent = `${textarea.value.length}/${maxLength} caractères`
      counter.style.color = remaining < 50 ? "#ff6b6b" : "#cccccc"
    }

    textarea.addEventListener("input", updateCounter)
    updateCounter()
  })
}

// Back to top functionality
function initializeBackToTop() {
  const backToTopBtn = document.getElementById("backToTop")
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", scrollToTop)
  }
}

function handleBackToTopVisibility() {
  const backToTopBtn = document.getElementById("backToTop")
  if (!backToTopBtn) return

  if (window.pageYOffset > 300) {
    backToTopBtn.classList.add("visible")
  } else {
    backToTopBtn.classList.remove("visible")
  }
}

// Notification system
function showNotification(message, type = "info", title = "") {
  const existingNotifications = document.querySelectorAll(".notification")
  existingNotifications.forEach((notification) => {
    notification.remove()
  })

  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 400px;
        padding: 20px;
        background: #1a1a1a;
        border-radius: 12px;
        box-shadow: 0 15px 35px rgba(214, 51, 132, 0.3);
        z-index: 10000;
        border-left: 4px solid ${getNotificationColor(type)};
        animation: slideInRight 0.3s ease;
        font-family: 'Inter', sans-serif;
        border: 1px solid rgba(255, 255, 255, 0.1);
    `

  const icon = getNotificationIcon(type)
  const titleHtml = title
    ? `<h4 style="margin: 0 0 10px 0; color: #ffffff; display: flex; align-items: center; gap: 8px; font-size: 16px;"><i class="${icon}" style="color: ${getNotificationColor(type)};"></i>${title}</h4>`
    : ""

  notification.innerHTML = `
        ${titleHtml}
        <p style="margin: 0; white-space: pre-line; line-height: 1.5; color: #cccccc; font-size: 14px;">${message}</p>
        <button onclick="this.parentElement.remove()" style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 20px; cursor: pointer; color: #cccccc; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.1)'; this.style.color='#ffffff';" onmouseout="this.style.background='none'; this.style.color='#cccccc';">&times;</button>
    `

  document.body.appendChild(notification)

  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove()
    }
  }, 6000)
}

function getNotificationColor(type) {
  const colors = {
    success: "#ff6b6b",
    error: "#dc3545",
    warning: "#ffc107",
    info: "#ff6b6b",
  }
  return colors[type] || colors.info
}

function getNotificationIcon(type) {
  const icons = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    warning: "fas fa-exclamation-triangle",
    info: "fas fa-info-circle",
  }
  return icons[type] || icons.info
}

// Loading functions
function showLoading() {
  const overlay = document.getElementById("loadingOverlay")
  if (overlay) {
    overlay.style.display = "flex"
  }
}

function hideLoading() {
  const overlay = document.getElementById("loadingOverlay")
  if (overlay) {
    overlay.style.display = "none"
  }
}

// Initialize Hero Logo
function initializeHeroLogo() {
  const logoContainer = document.querySelector(".hero-logo-container")

  if (logoContainer) {
    // Add click interaction
    logoContainer.addEventListener("click", function () {
      // Create ripple effect
      createRippleEffect(this)

      // Show company info
      showNotification(
        `🌊 Mind & Wave\n\nVotre partenaire de confiance en ressources humaines.\n\n✨ Excellence • Innovation • Performance\n\n💡 Cliquez sur "Découvrir nos services" pour en savoir plus !`,
        "info",
        "Mind & Wave",
      )

      // Track interaction
      trackEvent("logo_clicked", "hero_section")
    })

    // Add keyboard accessibility
    logoContainer.setAttribute("tabindex", "0")
    logoContainer.setAttribute("role", "button")
    logoContainer.setAttribute("aria-label", "Logo Mind & Wave - Cliquez pour plus d'informations")

    logoContainer.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        this.click()
      }
    })
  }
}

// Create Ripple Effect
function createRippleEffect(element) {
  const ripple = document.createElement("div")
  const rect = element.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)

  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 107, 107, 0.3);
    transform: scale(0);
    animation: rippleAnimation 0.6s linear;
    width: ${size}px;
    height: ${size}px;
    left: 50%;
    top: 50%;
    margin-left: ${-size / 2}px;
    margin-top: ${-size / 2}px;
    pointer-events: none;
    z-index: 1;
  `

  element.style.position = "relative"
  element.appendChild(ripple)

  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.parentNode.removeChild(ripple)
    }
  }, 600)
}

// Add CSS animations dynamically
const style = document.createElement("style")
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification {
        font-family: 'Inter', sans-serif;
    }
    
    /* Parallax CSS Variables */
    .hero::before {
        transform: translateY(var(--bg-transform, 0px));
    }
    
    @keyframes rippleAnimation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @media (max-width: 768px) {
        .notification {
            right: 10px;
            left: 10px;
            max-width: none;
        }
        
        .hero::before {
            background-attachment: scroll !important;
        }
    }
`
document.head.appendChild(style)

// Console welcome message
console.log(`
🎉 Mind & Wave - Site Web
📧 Contact: contact@mindwave.fr
📞 Téléphone: +33 1 23 45 67 89
🌐 Version: 3.0.0
🎨 Style Little Comets Academy avec effet parallax
✨ Dégradé rose/rouge et animations fluides
`)
