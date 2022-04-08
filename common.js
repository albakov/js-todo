/**
 * Tabs
 */
const tab = {
    init() {
        this.tabLinks = document.querySelectorAll('.nav-link');

        this.tabLinks.forEach(function (v) {
            v.addEventListener('click', function (e) {
                e.preventDefault();
                
                const currentTab = document.getElementById(v.getAttribute('href').replace('#', ''));
        
                tab.disableTabs();
                v.classList.add('active');
            });
        });
    },

    disableTabs() {
        tab.tabLinks.forEach(function (v) {
            v.classList.remove('active');
        });
    },
};

tab.init();

/**
 * Form
 */
const handle = {
    itemTemplate: `<input class="form-check-input me-2" type="checkbox"> <span>%task%</span>`,
    itemCssClass: 'list-group-item d-flex align-items-center border-0 mb-2 rounded',

    init() {
        this.add();
        this.setCompleted();
    },

    add() {
        const form = document.getElementById('form'),
            input = document.getElementById('input-task'),
            list = document.getElementById('list-group');

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            if (input.value) {
                const item = document.createElement('li');

                item.setAttribute('class', handle.itemCssClass)
                item.innerHTML = handle.itemTemplate.replace('%task%', input.value);
                list.appendChild(item);
                input.value = ""
            }
        });
    },

    setCompleted() {
        document.addEventListener('change', function(e) {
            if (e.target.tagName === 'INPUT' && e.target.getAttribute('type') === 'checkbox') {
                const li = e.target.closest('li'),
                    span = li.getElementsByTagName('span')[0];

                if (e.target.checked) {
                    span.innerHTML = `<s>${span.innerHTML}</s>`;
                } else {
                    span.innerHTML = span.innerHTML.replace(/(\<s\>|\<\/s\>)/ig, '');
                }
            }            
        });
    },
};

handle.init();
