export default class MenuBreaker {
  constructor(data = {}) {
    this.element = data.element;
    this.callbacks = data.callbacks || {};

    this.settings = this.extendSettings(data.settings || {});

    if (typeof this.callbacks.onInit === 'function') {
      this.callbacks.onInit();
    }

    this.mobileMenu = document.querySelector('[data-menu-breaker-mobile]');
    this.openButton = document.querySelector('[data-menu-breaker-open]');
    this.closeButton = document.querySelector('[data-menu-breaker-close]');
    this.toggleButton = document.querySelector('[data-menu-breaker-toggle]');

    this.isOpen = false;

    this.changeMenu();
    this.menuButton(true);
    this.addEventListeners();
  }

  addEventListeners() {
    window.addEventListener('resize', this.onWindowResize);
  }

  onWindowResize = () => this.changeMenu();

  subLevels() {
    const items = this.element.querySelectorAll(':not(li) > ul > li > ul');

    for (const item of items) {
      const parentWidth = item.parentNode.clientWidth;
      const subMenuWidth = item.clientWidth;

      if (item.parentNode.offsetLeft + subMenuWidth > window.innerWidth) {
        item.style.marginLeft = `${-subMenuWidth + parentWidth}px`;
      } else {
        item.style.marginLeft = 0;
      }

      const subItems = item.querySelectorAll('li > ul');

      for (const subItem of subItems) {
        const subSubMenuWidth = subItem.offsetWidth;

        if (
          subItem.parentNode.parentNode.parentNode.offsetLeft +
            subSubMenuWidth +
            subMenuWidth >
          window.innerWidth
        ) {
          subItem.style.marginLeft = `${-subSubMenuWidth}px`;
        } else {
          subItem.style.marginLeft = `${subSubMenuWidth}px`;
        }
      }
    }
  }

  open() {
    this.mobileMenu.classList.add(this.settings['open-class']);
    this.isOpen = true;

    if (typeof this.callbacks.onMenuOpen === 'function') {
      this.callbacks.onMenuOpen();
    }
  }

  close() {
    this.mobileMenu.classList.remove(this.settings['open-class']);
    this.isOpen = false;

    if (typeof this.callbacks.onMenuClose === 'function') {
      this.callbacks.onMenuClose();
    }
  }

  menuButton(init) {
    if (init) {
      if (this.openButton) {
        this.openButton.addEventListener('click', () => this.open());
      }

      if (this.closeButton) {
        this.closeButton.addEventListener('click', () => this.close());
      }

      if (this.toggleButton) {
        this.toggleButton.addEventListener('click', () => {
          if (!this.isOpen) {
            this.open();
          } else {
            this.close();
          }
        });
      }
    }

    if (this.isOpen) {
      this.mobileMenu.classList.add(this.settings['open-class']);
    }
  }

  desktop() {
    if (this.mobileMenu.classList.contains(this.settings['open-class'])) {
      this.mobileMenu.classList.remove(this.settings['open-class']);
    }

    this.subLevels();
  }

  changeMenu() {
    if (this.element.offsetHeight > this.settings['navbar-height']) {
      this.menuButton(false);

      if (typeof this.callbacks.isMobile === 'function') {
        this.callbacks.isMobile();
      }
    } else {
      this.desktop();

      if (typeof this.callbacks.isDesktop === 'function') {
        this.callbacks.isDesktop();
      }
    }
  }

  extendSettings(settings) {
    const defaultSettings = {
      'navbar-height': 70,
      'open-class': 'open'
    };

    const newSettings = {};

    for (const property in defaultSettings) {
      if (property in settings) {
        newSettings[property] = settings[property];
      } else {
        newSettings[property] = defaultSettings[property];
      }
    }

    return newSettings;
  }
}

if (window.jQuery) {
  const $ = window.jQuery;

  $.fn.menuBreaker = function(data = {}) {
    return new MenuBreaker({
      element: this,
      ...data
    });
  };
}
