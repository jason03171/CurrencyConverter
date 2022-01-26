data = {
  countrydollar: [
    {
      country: "Taiwan",
      rate: 1,
      dollors: "TWD"
    },
    {
      country: "Japan",
      rate: 0.24,
      dollors: "JPY"
    },
    {
      country: "America",
      rate: 27.65,
      dollors: "USD"
    },
    {
      country: "UK",
      rate: 37.59,
      dollors: "GBP"
    }
  ],
  input: {
    upMoney: 1,
    upCountry: "Japan",
    upPreCountry: "Japan",
    downMoney: 0.24,
    downCountry: "Taiwan",
    downPreCountry: "Taiwan"
  }
};

let vm = new Vue({
  el: "#app",
  data: data,
  computed: {
    countrylist() {
      let obj = {
        sort: [],
        map: {}
      };
      this.countrydollar.forEach(({ country, rate, dollors }) => {
        if (!obj.map[country]) {
          obj.sort.push(country);
          obj.map[country] = {
            dollor: "",
            rate: ""
          };
        }
        obj.map[country].dollor = dollors;
        obj.map[country].rate = rate;
      });

      return obj;
    },
    upcontents() {
      if (this.input.upCountry) {
        return this.countrylist.map[this.input.upCountry];
      } else {
        return [];
      }
    },
    downcontents() {
      if (this.input.downCountry) {
        return this.countrylist.map[this.input.downCountry];
      } else {
        return [];
      }
    }
  },

  methods: {
    upchangedown() {
      if (this.input.upCountry === this.input.downCountry) {
        this.input.upCountry = this.input.downPreCountry;
        this.input.downCountry = this.input.upPreCountry;
        this.input.upPreCountry = this.input.upCountry;
        this.input.downPreCountry = this.input.downCountry;
      } else {
        this.input.upPreCountry = this.input.upCountry;
        this.input.downPreCountry = this.input.downCountry;
      }
      this.calcExchangeRate(true);
    },
    downchangeup() {
      this.calcExchangeRate(false);
    },

    calcExchangeRate(isUp) {
      if (isUp) {
        this.input.downMoney = parseFloat(
          Number.parseFloat(
            (this.input.upMoney * this.upcontents.rate) / this.downcontents.rate
          ).toFixed(4)
        );
      } else {
        this.input.upMoney = parseFloat(
          Number.parseFloat(
            (this.input.downMoney * this.downcontents.rate) /
              this.upcontents.rate
          ).toFixed(4)
        );
      }
    }
  }
});
