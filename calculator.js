const display = document.querySelector('.value');
const buttons = document.querySelectorAll('.calculator button');
const historyList = document.getElementById('historyList');


buttons.forEach((item) => {
    item.onclick = () => handleInput(item.dataset.button);
});

function handleInput(input) {
    try {
        if (input === 'C') {
            display.value = '';
        } else if (input === 'CE') {
            display.value = display.value.slice(0, -1);
        } else if (input === '=') {
            if (display.value !== '') {
                const expression = display.value;
                const result = eval(display.value); 
                display.value = result;

                const emptyMsg = historyList.querySelector('.empty-history');
                if (emptyMsg) emptyMsg.remove();

                const li = document.createElement('li');
                li.textContent = `${expression} = ${result}`;
                historyList.prepend(li);
            }
        } else {
            display.value += input;
        }
    } catch (err) {
        display.value = 'Invalid Entry';
        setTimeout(() => (display.value = ''), 1000);
    }
}

function highlightKey(buttonValue) {
    const btn = [...buttons].find(b => b.dataset.button === buttonValue);
    if (btn) {
        btn.classList.add('key-press');
        setTimeout(() => btn.classList.remove('key-press'), 150);
    }
}

document.addEventListener('keydown', (e) => {
    const key = e.key;

    if (!isNaN(key) || ['+', '-', '*', '/', '.'].includes(key)) {
        display.value += key;
        highlightKey(key);
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleInput('=');
        highlightKey('=');
    } else if (key === 'Backspace') {
        handleInput('CE');
        highlightKey('CE');
    } else if (key.toLowerCase() === 'c' || key === 'Escape') {
        handleInput('C');
        highlightKey('C');
    }
});

const toggleBtn = document.getElementById('toggleHistory');
const clearBtn = document.getElementById('clearHistory');
const historyPanel = document.getElementById('historyPanel');

toggleBtn.textContent = 'Show History'; 

toggleBtn.addEventListener('click', () => {
    historyPanel.classList.toggle('hidden');
    toggleBtn.textContent = historyPanel.classList.contains('hidden')
        ? 'Show History'
        : 'Hide History';
});

clearBtn.addEventListener('click', () => {
    historyList.innerHTML = '<li class="empty-history">No history yet.</li>';
});


const modeToggle = document.getElementById('modeToggle');

modeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});