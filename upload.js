function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (!bytes) {
        return '0 Byte';
    } 
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
 }

 const element = (tag, classes = [], content) => {
    const node = document.createElement(tag);
    if(classes.length) {
        node.classList.add(...classes);
    }
    if(content) {
        node.textContent = content;
    }

    return node;
 }

export function upload(selector, options = {}) {
    let files = [];
    const input = document.querySelector(selector);
    const preview = element('div', ['preview']);
    const openBtn = element('button', ['btn'], 'Открыть');
    const upload = element('button', ['btn', 'primary'], 'Загрузить');
    
    if (options.multi) {
        input.setAttribute('multiple', true);
    }
    if(options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','))
    }

    
    // document.createElement('button');
    // openBtn.classList.add('btn');
    // openBtn.textContent = 'Открыть';

    input.insertAdjacentElement('afterend', preview);
    input.insertAdjacentElement('afterend', upload);
    input.insertAdjacentElement('afterend', openBtn);

    const triggerInput = () => input.click();
    const changeHandler = (event) => {
        if(!event.target.files.length) {
            return;
        }

        files = Array.from(event.target.files);

        preview.innerHTML = '';
        files.forEach((item) => {
            if(!item.type.match('image')) {
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (event) => {
                const src = event.target.result;
                const shortName = `${item.name.substr(0, 17)}...`;
                preview.insertAdjacentHTML('afterbegin', `
                    <div class="preview-image">
                    <div class="preview-remove" data-name="${item.name}"> &times; </div>
                        <img src="${src}" alt="${item.name}" />
                        <div class="preview-info">
                            <span>${shortName}</span>
                            <span>${bytesToSize(item.size)}</span>
                        </div>
                    </div>
                `);
            };
            reader.readAsDataURL(item);
        });
    };

    const removeHandler = (event) => {
        if(!event.target.dataset.name) {
            return;
        }
        const {name} = event.target.dataset;
        files = files.filter(file => file.name != name);
        const block = preview
        .querySelector(`[data-name="${name}"]`)
        .closest('.preview-image');
        block.classList.add('removing');
        setTimeout(() => block.remove(), 230);
    };

    openBtn.addEventListener('click', triggerInput);
    input.addEventListener('change', changeHandler);
    preview.addEventListener('click', removeHandler);
}