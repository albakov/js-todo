/**
 * Tabs
 */
const tab = {
    init() {
        this.tabLinks = document.querySelectorAll('.js_tab-link');

        this.tabLinks.forEach(function (v) {
            v.addEventListener('click', function (e) {
                e.preventDefault();

                const currentTab = v.getAttribute('href');

                tab.disableAllTabs();
                v.classList.add('active');
                tab.filterItems(currentTab);
            });
        });
    },

    disableAllTabs() {
        tab.tabLinks.forEach(function (v) {
            v.classList.remove('active');
        });
    },

    filterItems(currentTab) {
        const items = document.querySelectorAll('.js_task-item');

        items.forEach(function (item) {
            item.style.display = 'block';
        });

        items.forEach(function (item) {
            const input = item.querySelector('.js_task-checkbox');

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
    itemTemplate: `<input class="form-check-input me-2 js_task-checkbox" type="checkbox"> <span class="js_task-title">%task%</span>`,
    itemCssClass: 'list-group-item align-items-center border-0 mb-2 rounded js_task-item',

    init() {
        this.addNewItemEventListener();
    },

    addNewItemEventListener() {
        const form = document.querySelector('.js_form'),
            input = document.querySelector('.js_form-input'),
            list = document.querySelector('.js_task-list');

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (input.value) {
                const item = document.createElement('li'),
                    activeTab = document.querySelectorAll('.nav-link.active')[0];

                item.setAttribute('class', handle.itemCssClass)
                item.innerHTML = handle.itemTemplate.replace('%task%', input.value);
                list.appendChild(item);
                input.value = "";
                tab.filterItems(activeTab.getAttribute('href'));

                handle.setItemOnClickEventListener();
            }
        });
    },

    setItemOnClickEventListener() {
        const item = document.querySelector('.js_task-item');

        item.onclick = function (e) {
            const isCheckbox = e.target.classList.contains('js_task-checkbox'),
                parentNode = isCheckbox ? e.target.closest('li') : e.currentTarget,
                itemTitle = parentNode.querySelector('.js_task-title'),
                checkbox = parentNode.querySelector('.js_task-checkbox');

            if (!isCheckbox) {
                checkbox.checked = !checkbox.checked;
            }

            handle.toggleItem(checkbox, itemTitle);
        };
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
