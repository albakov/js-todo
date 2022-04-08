/**
 * Tabs
 */
const tab = {
    init() {
        this.tabLinks = document.querySelectorAll('.nav-link');

        this.tabLinks.forEach(function (v) {
            v.addEventListener('click', function (e) {
                e.preventDefault();

                const currentTab = v.getAttribute('href');

                tab.disableTabs();
                v.classList.add('active');
                tab.filterItems(currentTab);
            });
        });
    },

    disableTabs() {
        tab.tabLinks.forEach(function (v) {
            v.classList.remove('active');
        });
    },

    filterItems(currentTab) {
        const items = document.querySelectorAll('.list-group-item');

        items.forEach(function (item) {
            item.style.display = 'block';
        });

        items.forEach(function (item) {
            const input = item.getElementsByTagName('input')[0];

            if (currentTab === '#active') {
                if (input.checked) {
                    item.style.display = 'none';
                }
            } else if (currentTab === '#completed') {
                if (!input.checked) {
                    item.style.display = 'none';
                }
            }
        });
    },
};

tab.init();

/**
 * Form
 */
const handle = {
    itemTemplate: `<input class="form-check-input me-2" type="checkbox"> <span>%task%</span>`,
    itemCssClass: 'list-group-item align-items-center border-0 mb-2 rounded',

    init() {
        this.add();
        this.setCompleted();
    },

    add() {
        const form = document.getElementById('form'),
            input = document.getElementById('input-task'),
            list = document.getElementById('list-group');

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (input.value) {
                const item = document.createElement('li'),
                    activeTab = document.querySelectorAll('.nav-link.active')[0];;

                item.setAttribute('class', handle.itemCssClass)
                item.innerHTML = handle.itemTemplate.replace('%task%', input.value);
                list.appendChild(item);
                input.value = "";
                tab.filterItems(activeTab.getAttribute('href'));
            }
        });
    },

    setCompleted() {
        document.addEventListener('click', function (e) {
            if (e.target.tagName === 'LI' && e.target.classList.contains('list-group-item')) {
                const span = e.target.getElementsByTagName('span')[0],
                    input = e.target.getElementsByTagName('input')[0];

                input.checked = !input.checked;
                handle.toggleItem(input, span);
            }
        });

        document.addEventListener('change', function (e) {
            if (e.target.tagName === 'INPUT' && e.target.getAttribute('type') === 'checkbox') {
                const li = e.target.closest('li'),
                    span = li.getElementsByTagName('span')[0],
                    input = li.getElementsByTagName('input')[0];

                handle.toggleItem(input, span);
            }
        });
    },

    toggleItem(input, span) {
        if (input.checked) {
            span.innerHTML = `<s>${span.innerHTML}</s>`;
        } else {
            span.innerHTML = span.innerHTML.replace(/(\<s\>|\<\/s\>)/ig, '');
        }
    },
};

handle.init();
