/**
 * EMC Beauty - Interactividad Frontend
 * Incluye:
 * 1. Configuración centralizada de WhatsApp (preparada para el número real)
 * 2. Menú hamburguesa responsive y navegación activa por scroll
 * 3. Filtro dinámico de catálogo por categoría
 * 4. Botones de consulta de producto vía WhatsApp con mensaje personalizado
 * 5. Visor Lightbox para la galería y botón volver arriba
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ========================================================================
     1. CONFIGURACIÓN DEL NEGOCIO (Fácil actualización al confirmar datos)
     ======================================================================== */
  const EMC_CONFIG = {
    businessName: 'EMC Beauty',
    // IMPORTANTE: Según el brief (pág. 2 y 5), el número de WhatsApp está pendiente de confirmar.
    // Cuando el cliente entregue su número (ej. "573001234567"), reemplaza el string vacío abajo:
    whatsappNumber: '',
    instagramUrl: 'https://www.instagram.com/emc.beautyy'
  };

  // Año dinámico en el footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ========================================================================
     2. MENÚ HAMBURGUESA RESPONSIVE
     ======================================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ========================================================================
     3. RESALTADO DE SECCIÓN ACTIVA Y BOTÓN VOLVER ARRIBA
     ======================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('back-to-top');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Mostrar u ocultar botón volver arriba
    if (backToTopBtn) {
      if (scrollY > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Marcar enlace activo en el menú
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 130;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ========================================================================
     4. FILTRO INTERACTIVO DEL CATÁLOGO DE PRODUCTOS
     ======================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const catalogCards = document.querySelectorAll('#catalog-grid .product-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Actualizar estado visual y accesible de pestañas
      filterButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const selectedCategory = btn.getAttribute('data-filter');

      catalogCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (selectedCategory === 'todos' || cardCategory === selectedCategory) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ========================================================================
     5. MODAL LIGHTBOX Y GESTIÓN DE CONSULTAS WHATSAPP
     ======================================================================== */
  const modal = document.getElementById('lightbox-modal');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');
  const modalBackdrop = document.getElementById('modal-backdrop');

  const openModal = (htmlContent) => {
    if (!modal || !modalBody) return;
    modalBody.innerHTML = htmlContent;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Clic en elementos de la Galería
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const caption = item.getAttribute('data-caption') || 'Fotografía EMC Beauty';
      openModal(`
        <h3 style="margin-bottom: 0.75rem;">Vista previa de Galería</h3>
        <div class="image-placeholder" style="height: 240px; margin-bottom: 1rem;">
          <div class="placeholder-inner">
            <span class="placeholder-title">${caption}</span>
            <small>Reemplazar con etiqueta &lt;img&gt; cuando se aprueben las fotos</small>
          </div>
        </div>
        <p style="font-size: 0.88rem; color: #5C5252;">Instagram oficial: <strong>@emc.beautyy</strong></p>
      `);
    });
  });

  // Clic en botones de consulta por WhatsApp
  const whatsappTriggers = document.querySelectorAll('.whatsapp-trigger');
  whatsappTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      const product = trigger.getAttribute('data-product') || 'sus productos';
      const message = encodeURIComponent(
        `Hola ${EMC_CONFIG.businessName}, vi su página web y me gustaría consultar información sobre: ${product}.`
      );

      // Si ya se configuró el número real, abre WhatsApp directamente
      if (EMC_CONFIG.whatsappNumber.trim() !== '') {
        const waUrl = `https://wa.me/${EMC_CONFIG.whatsappNumber}?text=${message}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        return;
      }

      // Si el número sigue pendiente según el brief, informa con transparencia y ofrece Instagram
      e.preventDefault();
      openModal(`
        <h3 style="margin-bottom: 0.65rem;">Canal de WhatsApp</h3>
        <p style="font-size: 0.92rem; color: #5C5252; margin-bottom: 1rem;">
          El número oficial de WhatsApp de <strong>EMC Beauty</strong> está marcado como <em>pendiente de confirmar</em> en el brief empresarial.
        </p>
        <p style="font-size: 0.85rem; background: #F4E9E5; padding: 0.75rem; border-radius: 8px; margin-bottom: 1.25rem;">
          <strong>Mensaje listo para enviar:</strong><br>
          "Hola EMC Beauty, vi su página web y me gustaría consultar información sobre: ${product}."
        </p>
        <a href="${EMC_CONFIG.instagramUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-block">
          Escribir por Instagram (@emc.beautyy)
        </a>
      `);
    });
  });

  /* ========================================================================
     6. ANIMACIONES SUAVES AL HACER SCROLL (INTERSECTION OBSERVER)
     ======================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }
});