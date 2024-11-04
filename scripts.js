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
    setTimeout(calculateScores, 200);
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
    // 计算长跑额外加分
    const extra_data = data.extra_points;
    const extra_run = document.getElementById('gender').value === 'male' ? extra_data['1000m'] : extra_data['800m'];
    const extra_up = document.getElementById('gender').value === 'male' ? extra_data.pull_ups : extra_data.sit_ups;
    if(input_run < 195) {
        const extra_time = 195 - input_run;
        for (let i = 0; i < extra_run.length; i++) {
            if(extra_time >= extra_run[i].time_reduction) {
                score_run += extra_run[i].extra_score;
                break;
            }
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
    // 计算额外加分
    const full_count = document.getElementById('gender').value === 'male' ? 20 : 57;
    if (input_up > full_count) {
        const extra_count = input_up - full_count;
        for (let i = 0; i < extra_up.length; i++) {
            if (extra_count >= extra_up[i].count) {
                score_up += extra_up[i].extra_score;
                break;
            }
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
    if (score_all > 100)
        score_all = 100;
    outputElement.textContent = `${score_all}`;
    saveFormData();
}

// 将表单数据保存到cookie中
function saveFormData() {
    const expirationDays = 7;
    const gender = document.getElementById("gender").value;
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    const score50m = document.getElementById("score50m").value;
    const scoreLongJump = document.getElementById("scoreLongJump").value;
    const scoreSitReach = document.getElementById("scoreSitReach").value;
    const scoreVitalCapacity = document.getElementById("scoreVitalCapacity").value;
    const scoreRun = document.getElementById("scoreRun").value;
    const scorePullUp = document.getElementById("scorePullUp").value;

    // 创建一个有效期的cookie
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + expirationDate.toUTCString();

    // 将每个表单数据存储为cookie
    document.cookie = "gender=" + gender + ";" + expires + ";path=/";
    document.cookie = "height=" + height + ";" + expires + ";path=/";
    document.cookie = "weight=" + weight + ";" + expires + ";path=/";
    document.cookie = "score50m=" + score50m + ";" + expires + ";path=/";
    document.cookie = "scoreLongJump=" + scoreLongJump + ";" + expires + ";path=/";
    document.cookie = "scoreSitReach=" + scoreSitReach + ";" + expires + ";path=/";
    document.cookie = "scoreVitalCapacity=" + scoreVitalCapacity + ";" + expires + ";path=/";
    document.cookie = "scoreRun=" + scoreRun + ";" + expires + ";path=/";
    document.cookie = "scorePullUp=" + scorePullUp + ";" + expires + ";path=/";
}

// 读取cookie并将值加载到表单
function loadFormData() {
    const cookies = document.cookie.split("; ");
    const cookieObject = {};

    // 将每个cookie转换为键值对存储到对象中
    cookies.forEach(cookie => {
        const [key, value] = cookie.split("=");
        cookieObject[key] = decodeURIComponent(value);
    });

    // 填充表单值
    if (cookieObject.gender) document.getElementById("gender").value = cookieObject.gender;
    if (cookieObject.height) document.getElementById("height").value = cookieObject.height;
    if (cookieObject.weight) document.getElementById("weight").value = cookieObject.weight;
    if (cookieObject.score50m) document.getElementById("score50m").value = cookieObject.score50m;
    if (cookieObject.scoreLongJump) document.getElementById("scoreLongJump").value = cookieObject.scoreLongJump;
    if (cookieObject.scoreSitReach) document.getElementById("scoreSitReach").value = cookieObject.scoreSitReach;
    if (cookieObject.scoreVitalCapacity) document.getElementById("scoreVitalCapacity").value = cookieObject.scoreVitalCapacity;
    if (cookieObject.scoreRun) document.getElementById("scoreRun").value = cookieObject.scoreRun;
    if (cookieObject.scorePullUp) document.getElementById("scorePullUp").value = cookieObject.scorePullUp;
}

loadJSON()

// 页面加载时自动读取数据
window.onload = function() {
    loadFormData();
    setTimeout(calculateBMI,100);
};