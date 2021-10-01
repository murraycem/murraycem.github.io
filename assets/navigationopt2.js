var Navigation = function () {

    this.layout = $('.layout')
    this.hamburger = $('#mainMenuBtn')
    this.closeButton = $('#hmenu-close')
    this.userButton = $('#_hmenu_user')
    this.menuTabs = $('.menu-tabs')
    this.keyCode = Object.freeze({
        'TAB': 9,
        'RETURN': 13,
        'ESC': 27,
        'SPACE': 32,
        'PAGEUP': 33,
        'PAGEDOWN': 34,
        'END': 35,
        'HOME': 36,
        'LEFT': 37,
        'UP': 38,
        'RIGHT': 39,
        'DOWN': 40
    });
}

Navigation.prototype.init = function () {
    this.hamburger.on('click', this.handleHamburgClick.bind(this))
    this.closeButton.on('click', this.handleCloseMenuClick.bind(this))

    this.menuTabs.on('click', '[data-tab]', this.handleMenuTabClick.bind(this))
    this.menuTabs.on('keydown', this.handleTabKeyDown.bind(this));

    $('.tab-content').on('click', 'button', this.handleMenuButtonClick.bind(this))
    $('.tab-content').on('keydown', 'button', this.handleMenuButtonKeyDown.bind(this))


    $('.tab-content').on('click', 'a', this.handleMenuLinkClick.bind(this))
    $('.tab-content').on('keydown', 'a', this.handleMenuKeyDown.bind(this))

    $('#classic-dashboard').on('keydown', this.handleDashboardKeyDown.bind(this))
    $('.hmenu').on('keydown', this.handlemenuEscape.bind(this))

}

Navigation.prototype.handleHamburgClick = function (event) {
    this.layout.addClass('menu-shown')
    this.userButton.focus()
}

Navigation.prototype.closeMenu = function () {
    this.hamburger.focus()
    this.layout.removeClass('menu-shown')
}

Navigation.prototype.handleCloseMenuClick = function (event) {
  this.closeMenu()
}

Navigation.prototype.handlemenuEscape = function (event) {

    switch (event.keyCode) {
        case this.keyCode.ESC:
            this.closeMenu()
            event.preventDefault();
            break;

        default:
            break;
    }
}

Navigation.prototype.handleDashboardKeyDown = function (event) {
    const isShift = event.shiftKey
    switch (event.keyCode) {
        case this.keyCode.TAB:
            if (!isShift) {
                this.userButton.focus()
                event.stopPropagation();
                event.preventDefault();
            }
            break;

        default:
            break;
    }
}

Navigation.prototype.handleMenuTabClick = function (event) {
    var target = event.currentTarget,
        char = event.key
    this.switchToTab(target.id)

}

Navigation.prototype.handleTabKeyDown = function (event) {

    let  flag = false,
        id,
        nextId

    const children = this.menuTabs.children()
    const lastIndex = children.length - 1
    const currentIndex = this.menuTabs.find('.current').index()

    switch (event.keyCode) {
        case this.keyCode.LEFT:
            nextId = currentIndex - 1
            if (currentIndex === 0) {
                nextId = lastIndex
            }
            id = this.menuTabs.children().get(nextId).id
            this.switchToTab(id)
            flag = true;
            break;

        case this.keyCode.RIGHT:
            nextId = currentIndex + 1
            if (currentIndex === lastIndex) {
                nextId = 0
            }
            id = this.menuTabs.children().get(nextId).id
            this.switchToTab(id)
            flag = true;
            break;

        case this.keyCode.HOME:
            id = children.get(0).id
            this.switchToTab(id)
            flag = true;
            break;

        case this.keyCode.END:
            id = children.get(lastIndex).id
            this.switchToTab(id)
            flag = true;
            break;

        default:
            break;
    }

    if (flag) {
        event.stopPropagation();
        event.preventDefault();
    }
}

Navigation.prototype.switchToTab = function (tabButtonId) {
    this.menuTabs.children().removeClass('current')
    $('#' + tabButtonId).addClass('current')

    let tabId = '#' + tabButtonId.substring(0, tabButtonId.indexOf('_'))
    $('.tab-content').removeClass('current')
    $(tabId).parent().addClass('current')

    let children = this.menuTabs.children()
    children.each(index => {
        let currentChild = children.get(index)
        if (currentChild.id !== tabButtonId) {
            currentChild.tabIndex = -1
        } else {
            currentChild.tabIndex = 0
            currentChild.focus()
        }
    })
}

Navigation.prototype.updateTabIndex = function (target) {
    $('.tab-content [role=menuitem]').attr('tabIndex', '-1')
    $(target).attr('tabIndex', '0')
}

Navigation.prototype.toggleMenu = function (target) {

    if ($(target).hasClass('menu-opened')) {
        $(target).closest('ul').find('button').removeClass('menu-opened')
        $(target).closest('ul').find('button').attr('aria-expanded', false)
        $(target).closest('ul').find('ul').addClass('menu-closed')
        this.updateTabIndex(target)
        target.focus()
    } else {
        $(target).closest('ul').find('button').removeClass('menu-opened')
        $(target).closest('ul').find('button').attr('aria-expanded', false)
        $(target).addClass('menu-opened')
        $(target).attr('aria-expanded', true)
        $(target).closest('ul').find('ul').addClass('menu-closed')
        $(target).next().removeClass('menu-closed')
        let nextObject =  $($(target).next().find('li').get(0)).children().get(0)
        nextObject.focus()
        this.updateTabIndex(nextObject)

    }

}

Navigation.prototype.handleMenuButtonClick = function (event) {
    let target = event.currentTarget
    this.toggleMenu(target)
}

Navigation.prototype.getSubMenuIndex = function (item) {
    const itemObj = $(item)
    return itemObj.closest('ul').find(itemObj.closest('li')).index()
}

Navigation.prototype.handleMenuButtonKeyDown = function (event) {

    let target = event.currentTarget,
        flag = false,
        nextIndex,
        li,
        nextObject

    const parentMenu = $(target).closest('ul')
    const siblings = parentMenu.children()
    const lastIndex = siblings.length - 1
    const parentCategory = parentMenu.prev()
    const currentIndex = this.getSubMenuIndex(target)

   switch (event.keyCode) {
        case this.keyCode.LEFT:
            if ($(target).attr('aria-expanded') === 'true') {
                this.toggleMenu(target)
                flag = true;
            } else {
                if (parentCategory.length) {
                    this.toggleMenu(parentCategory)
                }
                flag = true;
            }
            break;
        case this.keyCode.RIGHT:
            if ($(target).attr('aria-expanded') === 'false') {
                this.toggleMenu(target)
                flag = true;
            }
            break;
       case this.keyCode.DOWN:
           nextIndex = currentIndex + 1
           if (currentIndex === lastIndex) {
               nextIndex = 0
           }
           li = siblings.get(nextIndex)
           nextObject = $(li).children().get(0)
           this.updateTabIndex(nextObject)
           nextObject.focus()
           flag = true;
           break;
       case this.keyCode.UP:
           nextIndex = currentIndex - 1
           if (currentIndex === 0) {
               nextIndex = lastIndex
           }
           li = siblings.get(nextIndex)
           nextObject = $(li).children().get(0)
           this.updateTabIndex(nextObject)
           nextObject.focus()
           flag = true;
           break;
       case this.keyCode.HOME:
           li = siblings.get(0)
           nextObject = $(li).children().get(0)
           this.updateTabIndex(nextObject)
           nextObject.focus()
           flag = true;
           break;
       case this.keyCode.END:
           li = siblings.get(lastIndex)
           nextObject = $(li).children().get(0)
           this.updateTabIndex(nextObject)
           nextObject.focus()
           flag = true;
           break;
        case this.keyCode.RETURN:
        case this.keyCode.SPACE:
            break;
        default:
            break;
    }

    if (flag) {
        event.stopPropagation();
        event.preventDefault();
    }
}

Navigation.prototype.handleMenuSelected = function (target) {
    this.closeMenu()
    alert('link ' + target.textContent + ' clicked')
}

Navigation.prototype.handleMenuLinkClick = function (event) {

    let target = event.currentTarget
    this.handleMenuSelected(target)
}

Navigation.prototype.handleMenuKeyDown = function (event) {

    let  target = event.currentTarget,
        flag = false,
        nextIndex,
        li,
        nextObject

    const parentMenu = $(target).closest('ul')
    const siblings = parentMenu.children()
    const lastIndex = siblings.length - 1
    const parentCategory = parentMenu.prev()
    const currentIndex = this.getSubMenuIndex(target)

    switch (event.keyCode) {
        case this.keyCode.LEFT:
            this.toggleMenu(parentCategory)
            flag = true;
            break;
        case this.keyCode.DOWN:
            nextIndex = currentIndex + 1
            if (currentIndex === lastIndex) {
                nextIndex = 0
            }
            li = siblings.get(nextIndex)
            nextObject = $(li).children().get(0)
            this.updateTabIndex(nextObject)
            nextObject.focus()
            flag = true;
            break;
        case this.keyCode.UP:
            nextIndex = currentIndex - 1
            if (currentIndex === 0) {
                nextIndex = lastIndex
            }
            li = siblings.get(nextIndex)
            nextObject = $(li).children().get(0)
            this.updateTabIndex(nextObject)
            nextObject.focus()
            flag = true;
            break;
        case this.keyCode.HOME:
            li = siblings.get(0)
            nextObject = $(li).children().get(0)
            this.updateTabIndex(nextObject)
            nextObject.focus()
            flag = true;
            break;
        case this.keyCode.END:
            li = siblings.get(lastIndex)
            nextObject = $(li).children().get(0)
            this.updateTabIndex(nextObject)
            nextObject.focus()
            flag = true;
            break;
        default:
            break;
    }

    if (flag) {
        event.stopPropagation();
        event.preventDefault();
    }
}

