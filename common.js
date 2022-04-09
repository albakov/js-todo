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
 * Form Handler
 */
const formHandler = {
    itemTemplate: `<input class="form-check-input me-2 js_task-checkbox" type="checkbox"> <span class="js_task-title">%task%</span> <button type="button" class="btn btn-delete btn-danger js_task-delete" data-id="%id%">Delete</span>`,
    itemCssClass: 'list-group-item align-items-center border-0 mb-2 rounded js_task-item',

    init() {
        this.form = document.querySelector('.js_form');
        this.input = document.querySelector('.js_form-input');
        this.list = document.querySelector('.js_task-list');

        this.addNewItemEventListener();
    },

    addNewItemEventListener() {
        formHandler.form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (formHandler.input.value) {
                backService.addItem(formHandler.input.value)
                    .then(res => {
                        formHandler.addItem(JSON.parse(res));
                    })
                    .finally(() => {
                        formHandler.input.value = "";
                    });
            }
        });
    },

    addItem(task) {
        const item = document.createElement('li'),
            activeTab = document.querySelector('.nav-link.active');

        item.setAttribute('data-id', task.id);
        item.setAttribute('class', formHandler.itemCssClass);

        item.innerHTML = formHandler.itemTemplate
            .replace('%task%', task.title)
            .replace('%id%', task.id);

        formHandler.list.appendChild(item);

        formHandler.toggleCompletedTitle(task.completed, item.querySelector('.js_task-title'));
        item.querySelector('.js_task-checkbox').checked = task.completed === 1;

        tab.filterItems(activeTab.getAttribute('href'));

        formHandler.toggleCompletedOnClickEventListener(item);
        formHandler.deleteItemEventListener(item);
    },

    toggleCompletedOnClickEventListener(item) {
        item.onclick = function (e) {
            if (!e.target.classList.contains('js_task-delete')) {
                const isCheckbox = e.target.classList.contains('js_task-checkbox'),
                    parentNode = isCheckbox ? e.target.closest('li') : e.currentTarget,
                    itemTitle = parentNode.querySelector('.js_task-title'),
                    checkbox = parentNode.querySelector('.js_task-checkbox');

                if (!isCheckbox) {
                    checkbox.checked = !checkbox.checked;
                }

                backService.setCompleted(parentNode.dataset.id, checkbox.checked ? 1 : 0)
                    .then(() => {
                        formHandler.toggleCompletedTitle(checkbox.checked, itemTitle);
                    });
            }
        };
    },

    deleteItemEventListener(item) {
        item.querySelector('.js_task-delete').onclick = function (e) {
            backService.deleteItem(e.target.dataset.id)
                .then(() => {
                    item.remove();
                });
        };
    },

    toggleCompletedTitle(isCompleted, span) {
        if (isCompleted) {
            span.innerHTML = `<s>${span.innerHTML}</s>`;
        } else {
            span.innerHTML = span.innerHTML.replace(/(\<s\>|\<\/s\>)/ig, '');
        }
    },
};

formHandler.init();

/**
 * Back Service
 */
const backService = {
    prefix: 'http://localhost:8080/api/',

    init() {
        this.getAllItems();
    },

    getAllItems() {
        this.request('GET', 'items')
            .then(res => {
                const items = JSON.parse(res);

                items.forEach(function (task) {
                    formHandler.addItem(task);
                });
            });
    },

    addItem(title) {
        return this.request('POST', 'items', JSON.stringify({ Title: title }));
    },

    setCompleted(id, completed) {
        return this.request('POST', `items/${id}`, JSON.stringify({ Completed: completed }));
    },

    deleteItem(id) {
        return this.request('DELETE', `items/${id}`);
    },

    request(method, url, data = '') {
        return new Promise((res, rej) => {
            const xhr = new XMLHttpRequest();

            xhr.open(method, this.prefix + url, false);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.send(data);

            if (xhr.status > 299) {
                rej(xhr.response);
            } else {
                res(xhr.response);
            }
        });
    },
};

backService.init();
