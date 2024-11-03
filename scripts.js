let maleData
let femaleData

async function loadJSON() {
    try {
        const responseMale = await fetch('score_male.json');
        maleData = await responseMale.json();
        const responseFemale = await fetch('score_female.json');
        femaleData = await responseFemale.json();
    } catch (error) {
        console.error('Error loading json:', error);
    }
}

function calculateBMI(){
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    if (height > 0 && weight > 0) {
        const bmi = weight / Math.pow(height / 100, 2);
        document.getElementById('bmiResult').textContent = bmi.toFixed(2);
    } else {
        document.getElementById('bmiResult').textContent = '0';
    }
}

function calculateScores(){
    const data = document.getElementById('gender').value === 'male' ? maleData : femaleData
    const input_50m = parseFloat(document.getElementById('score50m').value);
    const input_jump = parseFloat(document.getElementById('scoreLongJump').value);
    const input_reach = parseFloat(document.getElementById('scoreSitReach').value);
    const input_vital = parseFloat(document.getElementById('scoreVitalCapacity').value);
    const input_run = parseFloat(document.getElementById('scoreRun').value);
    const input_up = parseFloat(document.getElementById('scorePullUp').value);
    const outputElement = document.getElementById('totalScore');
    const output_50m = document.getElementById('output50m');
    const output_jump = document.getElementById('outputjump');
    const output_reach = document.getElementById('outputreach');
    const output_vital = document.getElementById('outputvital');
    const output_run = document.getElementById('outputrun');
    const output_up = document.getElementById('outputup');
    // 根据成绩计算得分
    const events = data.events;
    const event_50m = events['50m'];
    const event_jump = events['jump'];
    const event_vital = events['vital_capacity'];
    const event_reach = events['sit_reach'];
    const event_run = document.getElementById('gender').value === 'male' ? events['1000m'] : events['800m'];
    const event_up = document.getElementById('gender').value === 'male' ? events['pull_ups'] : events['sit_ups'];
    let score_50m = 0;
    let score_jump = 0;
    let score_reach = 0;
    let score_vital = 0;
    let score_run = 0;
    let score_up = 0;

    document.getElementById('genderDisplay').innerText = document.getElementById('gender').value === 'male' ? '男' : '女'

    // 计算50m得分
    for (let i = 0; i < event_50m.length; i++) {
        const event = event_50m[i];
        if (input_50m <= event.time) {
            score_50m = event.score;
            break;
        }
    }
    output_50m.textContent = `${score_50m}`;

    // 计算跳远得分
    for (let i = 0; i < event_jump.length; i++) {
        const event = event_jump[i];
        // 找到对应的成绩，向下取整得分
        if (input_jump >= event.distance) {
            score_jump = event.score;
            break;
        }
    }
    output_jump.textContent = `${score_jump}`;

    // 计算坐位体前屈得分
    for (let i = 0; i < event_reach.length; i++) {
        const event = event_reach[i];
        // 找到对应的成绩，向下取整得分
        if (input_reach >= event.value) {
            score_reach = event.score;
            break;
        }
    }
    output_reach.textContent = `${score_reach}`;

    // 计算肺活量得分
    for (let i = 0; i < event_vital.length; i++) {
        const event = event_vital[i];
        // 找到对应的成绩，向下取整得分
        if (input_vital >= event.value) {
            score_vital = event.score;
            break;
        }
    }
    output_vital.textContent = `${score_vital}`;

    // 计算长跑得分
    for (let i = 0; i < event_run.length; i++) {
        const event = event_run[i];
        // 找到对应的成绩，向下取整得分
        if (input_run <= event.time) {
            score_run = event.score;
            break;
        }
    }
    output_run.textContent = `${score_run}`;

    // 计算引体向上/仰卧起坐得分
    for (let i = 0; i < event_up.length; i++) {
        const event = event_up[i];
        // 找到对应的成绩，向下取整得分
        if (input_up >= event.count) {
            score_up = event.score;
            break;
        }
    }
    output_up.textContent = `${score_up}`;

    // 计算总分
    const bmi_list = data.BMI.scoring;
    let score_bmi;
    for (let i = 0; i < bmi_list.length; i++) {
        const low = bmi_list[i].low;
        const high = bmi_list[i].high;
        let bmi_value = parseFloat(document.getElementById('bmiResult').innerText);
        if(bmi_value >= low && bmi_value <= high){
            score_bmi = bmi_list[i].score;
            break;
        }
    }
    let score_all = score_run * 0.2 + score_50m * 0.2 + score_up * 0.1 + score_jump * 0.1 +score_vital * 0.15 + score_reach * 0.1 + score_bmi * 0.15
    outputElement.textContent = `${score_all}`;
}

loadJSON();