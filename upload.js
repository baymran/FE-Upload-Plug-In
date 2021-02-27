export function upload(selector, options = {}) {
    const input = document.querySelector(selector);
    const preview = document.createElement('div');
          preview.classList.add('preview');

    if (options.multi) {
        input.setAttribute('multiple', true);
    }
    if(options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','))
    }

    const openBtn = document.createElement('button');
    openBtn.classList.add('btn');
    openBtn.textContent = 'Открыть';

    input.insertAdjacentElement('afterend', preview);
    input.insertAdjacentElement('afterend', openBtn);

    const triggerInput = () => input.click();
    const changeHandler = (event) => {
        if(!event.target.files.length) {
            return;
        }

        const files = Array.from(event.target.files);

        preview.innerHTML = '';
        files.forEach((item) => {
            if(!item.type.match('image')) {
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (event) => {
                const src = event.target.result;
                preview.insertAdjacentHTML('afterbegin', `
                    <div class="preview-image">
                        <img src="${src}" alt="${item.name}" />
                    </div>
                `);
            };
            reader.readAsDataURL(item);
        });
    };

    openBtn.addEventListener('click', triggerInput);
    input.addEventListener('change', changeHandler);
}