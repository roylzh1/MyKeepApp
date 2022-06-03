const form = document.querySelector(".form");
const containerWorkerouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form_input--type");
const inputDistance = document.querySelector(".form_input--distance");
const inputDuration = document.querySelector(".form_input--duration");
const inputCadence = document.querySelector(".form_input--cadence");
const inputElevation = document.querySelector(".form_input--elevation");
const inputSubmit = document.querySelector(".user_input");
const inputName = document.querySelector(".userLogin_input");
const inputPassword = document.querySelector(".userMima_input");
const inputText = document.querySelector(".text2");
const userImage = document.querySelector(".img");

////////////////////////////////////////////////////////////////////////////////
//应用架构
class App {
  #map;
  #mapEvent;
  #workouts = [];
  #mapZommLevel = 15;
  account;

  constructor() {
    this._getPosition(); //获取位置
    form.addEventListener("submit", this._newWorkout.bind(this)); //第一个this指向form,事件监听自带的this指向，第二个才是指向app
    inputType.addEventListener("change", this._toggleElevationField);
    containerWorkerouts.addEventListener("click", this._moveToPopup.bind(this));
    inputSubmit.addEventListener("submit", this._getUserinformation.bind(this));
  }

  _getPosition() {
    navigator.geolocation.getCurrentPosition(
      this._loadMap.bind(this),
      function () {
        alert("Could not get your position");
      }
    );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(
      "https://www.google.pt/maps/@" + latitude + "," + longitude + "z"
    );
    const coords = [latitude, longitude];
    this.#map = L.map("map").setView(coords, this.#mapZommLevel);
    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    //点击地图事件
    this.#map.on("click", this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus(); //提取地图事件参数
  }

  _hideForm() {
    inputDistance.value =
      inputCadence.value =
      inputDuration.value =
      inputElevation.value =
        "";

    form.classList.add("hidden");
  }

  _toggleElevationField() {
    //有则移除，没有添加
    inputElevation.closest(".form_row").classList.toggle("form_row--hidden");
    inputCadence.closest(".form_row").classList.toggle("form_row--hidden");
  }

  _newWorkout(e) {
    e.preventDefault();

    const validInputs = (
      ...inputs //任意数量的参数
    ) => inputs.every((item) => Number.isFinite(item));
    const allPositive = (...inputs) => inputs.every((item) => item > 0);

    e.preventDefault();
    //获取date
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    var workout;
    //跑步类型，则创建跑步对象
    if (type === "跑步") {
      const cadence = +inputCadence.value;
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert("请输入有效的数据");
      workout = new Running(
        [lat, lng],
        distance,
        duration,
        this.account.name,
        cadence
      );
    }
    //骑行类型，则创建骑行对象
    if (type === "骑行") {
      const elevation = +inputElevation.value;
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert("请输入有效的数据");
      workout = new Cycling(
        [lat, lng],
        distance,
        duration,
        this.account.name,
        elevation
      );
    }
    //添加此对象到workout数组
    this.#workouts.push(workout);
    //console.log(workout);

    //渲染标记
    this._renderWorkoutMarker(workout);
    //渲染workout到list
    this._renderWorkout(workout);
    this._hideForm();
    //设置数据库
    this._setLocalStorage(this.account);
  }

  _renderWorkout(workout) {
    let html = "";
    if (workout.type === "跑步")
      html += `
          <li class='workout workout--${workout.type1}' data-id='${workout.id}'>
            <h2 class="workout_title">${workout.discription}</h2>
            <div class="w-box">
            <div class="workout_details">
              <image class="workout_icon" src="./keepImage/跑步.png"></image>
              <span class="workout_value">${workout.distance}</span>
              <span class="workout_unit">KM</span>
            </div>
            <div class="workout_details">
              <image class="workout_icon" src="./keepImage/时间.png"></image>
              <span class="workout_value">${workout.duration}</span>
              <span class="workout_unit">MIN</span>
            </div>
            <div class="workout_details">
              <image class="workout_icon" src="./keepImage/闪电.png"></image>
              <span class="workout_value">${workout.pace.toFixed(1)}</span>
              <span class="workout_unit">MIN/KM</span>
            </div>
            <div class="workout_details">
              <image class="workout_icon" src="./keepImage/脚印,脚,足迹,足印.png"></image>
              <span class="workout_value">${workout.cadence}</span>
              <span class="workout_unit">SPM</span>
            </div>
          </div>
          </li>
          `;
    if (workout.type === "骑行") {
      console.log(workout);
      html += `
         <li class='workout workout--${workout.type1}' data-id='${workout.id}'>
            <h2 class="workout_title">${workout.discription}</h2>
            <div class="w-box">
            <div class="workout_details">
              <image class="workout_icon" src="./keepImage/自行车.png"></image>
              <span class="workout_value">${workout.distance}</span>
              <span class="workout_unit">KM</span>
            </div>
            <div class="workout_details">
              <image class="workout_icon" src="./keepImage/时间.png"></image>
              <span class="workout_value">${workout.duration}</span>
              <span class="workout_unit">MIN</span>
            </div>
            <div class="workout_details">
              <image class="workout_icon" src="./keepImage/闪电.png"></image>
              <span class="workout_value">${workout.speed.toFixed(1)}</span>
              <span class="workout_unit">KM/H</span>
            </div>
            <div class="workout_details">
              <image class="workout_icon" src="./keepImage/海拔.png"></image>
              <span class="workout_value">${workout.elevationGain}</span>
              <span class="workout_unit">M</span>
            </div>
          </div>
          </li>
          `;
    }

    form.insertAdjacentHTML("afterend", html);
  }

  _moveToPopup(e) {
    const workoutEl = e.target.closest(".workout");
    if (!workoutEl) return;
    const workout = this.#workouts.find(
      (work) => work.id === workoutEl.dataset.id
    );
    this.#map.setView(workout.coords, this.#mapZommLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map) //标记
      .bindPopup(
        L.popup({
          minWidth: 60,
          maxWidth: 140,
          maxHeight: 20,
          autoClose: false,
          closeOnClick: false,
          className: workout.type1 + "-popup",
        })
      )
      .setPopupContent(
        `${workout.type === "跑步" ? "🏃" : "🚴"} ${workout.discription}`
      )
      .openPopup();
  }

  _setLocalStorage(account) {
    //浏览器提供的数据库api
    localStorage.setItem(`${account.name}`, JSON.stringify(this.#workouts));
    //                    数据库名称         数据
  }

  _getLocalStorage(account) {
    const data = JSON.parse(localStorage.getItem(`${account.name}`));
    if (!data) return;
    this.#workouts = data; //重新写入数据到数组          **************
    this.#workouts.forEach((work) => {
      this._renderWorkout(work);
    });
  }

  _getUserinformation(e, account) {
    e.preventDefault();
    var uesername = inputName.value;
    var userpassword = inputPassword.value;
    let oldpassword;
    console.log(localStorage.getItem(`${uesername}1`));
    if (!localStorage.getItem(`${uesername}`)) {
      this.account = new Account(uesername, userpassword);
      inputText.textContent = `${uesername}  开始记录你的运动!`;
      localStorage.setItem(`${this.account.name}1`, `${this.account.password}`);
      console.log(localStorage.getItem(`${uesername}1`));
    } else {
      oldpassword = localStorage.getItem(`${uesername}1`);
    }

    if (localStorage.getItem(`${uesername}1`) === oldpassword) {
      inputText.textContent = `${uesername}  开始记录你的运动!`;
      this.account = new Account(uesername, userpassword);
      this._getLocalStorage(this.account); //获取数据    *************
      this.#workouts.forEach((work) => {
        this._renderWorkoutMarker(work);
      });
    }
    userImage.classList.remove("imgH");
  }

  reset() {
    localStorage.removeItem("workouts");
    location.reload();
  }
}

class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10); //唯一标识符 时间戳

  constructor(coords, distance, duration, name) {
    this.coords = coords; //[lat,lng]
    this.distance = distance; //km
    this.duration = duration; //min
    this.name = name; //account name
  }

  _setDescription() {
    const months = [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ];
    this.discription = `${this.type} ${
      months[this.date.getMonth()]
    }${this.date.getDate()}   完成`;
  }
}

class Running extends Workout {
  type = "跑步";
  type1 = "runner";
  constructor(coords, distance, duration, name, cadence) {
    super(coords, distance, duration, name);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    //         min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = "骑行";
  type1 = "cycling";
  constructor(coords, distance, duration, name, elevationGain) {
    super(coords, distance, duration, name);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    //     km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

class Account {
  constructor(name, password) {
    this.name = name;
    this.password = password;
  }
}

const app = new App(); //在global范围，将在javascirpt加载时立即执行
