<template>
  <div class="InputFee relative">
    <div class="w-full">
      <div class="InputFee__gradient absolute w-full" />
      <div
        :style="rangeTrackStyle"
        class="InputFee__range-track absolute w-full z-30"
      />
      <div
        :style="hiddenGradientStyle"
        class="InputFee__hidden-gradient absolute w-full z-10"
      />
    </div>

    <div class="InputFee__currency-input-container absolute z-20">
      <InputCurrency
        ref="input"
        :currency="currency"
        :label="$t('TRANSACTION.FEE')"
        :value="fee"
        :not-valid-error="notValidError"
        :maximum-amount="feeChoices.MAXIMUM"
        :maximum-error="maximumError"
        :minimum-amount="feeChoices.MINIMUM"
        :minimum-error="minimumError"
        class="w-full InputField--dirty"
        @raw="onRawInput"
      />
    </div>

    <input
      :value="fee"
      :max="feeChoices.MAXIMUM"
      :min="feeChoices.MINIMUM"
      :step="step"
      type="range"
      class="w-full m-0 py-2 z-10"
      name="fee"
      @input="onSlider($event.target.value)"
    >
    <p class="InputFee__choices absolute z-30">
      <button
        v-for="choice in Object.keys(feeChoices)"
        :key="choice"
        :class="{ 'InputFee__choice--active': choice === feeChoice }"
        class="InputFee__choice cursor-pointer font-semibold text-xs"
        @click="onChoice(choice)"
      >
        {{ $t(`INPUT_FEE.${choice}`) }}
      </button>
    </p>
  </div>
</template>

<script>
import InputCurrency from './InputCurrency'

/**
 * This component, like \`InputCurrency\`, uses a String value internally to
 * avoid several problems, such as showing the exponential notation, although
 * it emits a Number always
 */
export default {
  name: 'InputFee',

  components: {
    InputCurrency
  },

  props: {
    currency: {
      type: String,
      required: true
    },

    transactionType: {
      type: Number,
      required: true
    }
  },

  data () {
    const data = {
      feeChoices: {
        MINIMUM: Math.pow(10, -8),
        AVERAGE: 0.05,
        MAXIMUM: 0.1,
        CUSTOM: 0.05
      },
      feeChoice: 'AVERAGE',
      step: Math.pow(10, -8)
    }
    data.fee = data.feeChoices[data.feeChoice]
    return data
  },

  computed: {
    hiddenGradientStyle () {
      return {
        width: `${100 - this.rangePercentage}%`
      }
    },
    rangeTrackStyle () {
      return {
        width: `${this.rangePercentage}%`
      }
    },
    rangePercentage () {
      const percent = this.fee / this.feeChoices.MAXIMUM * 100
      return percent > 100 ? 100 : percent
    },
    notValidError () {
      return this.$t('INPUT_FEE.ERROR.NOT_VALID')
    },
    minimumError () {
      const min = this.feeChoices.MINIMUM
      const fee = this.currency_format(min, { currency: this.currency, currencyDisplay: 'code' })
      return this.$t('INPUT_FEE.ERROR.LESS_THAN_MINIMUM', { fee })
    },
    maximumError () {
      const max = this.feeChoices.MAXIMUM
      const fee = this.currency_format(max, { currency: this.currency, currencyDisplay: 'code' })
      return this.$t('INPUT_FEE.ERROR.MORE_THAN_MAXIMUM', { fee })
    }
  },

  created () {
    this.prepareFeeStatistics()
  },

  methods: {
    prepareFeeStatistics () {
      const { avgFee, maxFee, minFee } = this.$store.getters['network/feeStatisticsByType'](this.transactionType)

      this.feeChoices.AVERAGE = avgFee * Math.pow(10, -8)
      this.feeChoices.MAXIMUM = maxFee * Math.pow(10, -8)
      this.feeChoices.MINIMUM = minFee * Math.pow(10, -8)
      this.feeChoices.CUSTOM = this.feeChoices.AVERAGE
      this.setFee(this.feeChoices.AVERAGE)
    },
    focusInput () {
      this.$refs.input.focus()
    },
    onChoice (choice) {
      this.feeChoice = choice
      if (this.feeChoice === 'CUSTOM') {
        this.focusInput()
      }

      const fee = this.feeChoices[choice]
      this.emitFee(fee)
    },
    /**
     * Receives the `InputCurrency` value as String
     * @param {String} fee
     */
    onRawInput (fee) {
      this.feeChoice = 'CUSTOM'

      fee = fee.toString()
      this.feeChoices.CUSTOM = fee
      this.emitFee(fee)
    },
    /**
     * The native slider uses Strings
     * @param {String} fee
     */
    onSlider (fee) {
      this.feeChoice = 'CUSTOM'
      this.feeChoices.CUSTOM = fee
      this.emitFee(fee)
    },
    /**
     * Establishes the fee as String to avoid the exponential notation
     * @param {(String|Number)} fee
     */
    setFee (fee) {
      fee = fee.toString()

      // Convert the fee to String to not use the exponential notation
      const parts = fee.split('e-')
      if (parts.length > 1) {
        fee = parseFloat(fee).toFixed(parts[1])
      }

      this.fee = fee
      this.$v.fee.$touch()
    },
    /**
     * Establishes the fee as String to avoid the exponential notation, although
     * it emits the value as a Number
     * @param {String} fee
     */
    emitFee (fee) {
      this.setFee(fee)
      this.$emit('input', parseFloat(this.fee))
    }
  },

  validations: {
    fee: {
      isValid (value) {
        if (this.$refs.input) {
          return !this.$refs.input.$v.$invalid
        }
        return false
      }
    }
  }
}
</script>

<style>
.InputFee .InputField__input {
  border-bottom-width: 0px !important
}
.InputFee .InputCurrency,
.InputFee .InputCurrency input {
  /* This width is necessary to display error messages in 1 line */
  width: 15rem
}
.InputFee .InputField__helper {
  margin-top: 1.2rem;
}
</style>

<style scoped>
.InputFee {
  --margin-top: 2rem;
  --height: 3rem;
  --bg-colour: var(--theme-modal);
  --total-height: calc(var(--margin-top) + var(--height));
  --range-handler-height: 1.0rem;
  --range-handler-border: 0.35rem;
  --range-track-hidden-height: 0.6rem;
  --range-track-height: 0.4rem;
  --range-track-border: 0.25rem;
  --gradient-height: 3.6rem;
  --gradient-top: -50%;
  margin-top: var(--margin-top);
  margin-bottom: 0.9rem;
  height: var(--height);
}
/* The gradient and the layer that hides it have the same height */
.InputFee__gradient,
.InputFee__hidden-gradient {
  height: var(--gradient-height);
  top: var(--gradient-top);
}
.InputFee__gradient {
  left: 0;
  background: linear-gradient(115deg, var(--theme-fee-gradient-start) 5%, var(--theme-fee-gradient-end));
}
.InputFee__hidden-gradient {
  right: 0;
  background-color: var(--bg-colour);
}
.InputFee__range-track {
  height: var(--range-track-height);
  top: calc((var(--gradient-top) - var(--range-track-height)) * -1);
  left: 0;
  background-color: var(--theme-fee-range-track-active);
  z-index: 10;
  box-shadow: 0 2px 8px var(--theme-fee-range-shadow);
}

input[type=range] {
  /* Hides the slider so that custom slider can be made */
  -webkit-appearance: none;
  margin-top: calc(var(--range-handler-height));
  background: transparent;
  cursor: pointer;
}
input[type=range]::-webkit-slider-runnable-track {
  /* This height increases the area that can be clicked and dragged, although only the border is visible */
  height: var(--range-track-hidden-height);
  background-color: var(--bg-colour);
  margin-bottom: calc((var(--total-height) - var(--gradient-height)) * -1);
  border-top: var(--theme-fee-range-track) solid var(--range-track-border);
}
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  margin-top: calc(var(--range-handler-height) / -2);
  bottom: 0px;
  height: var(--range-handler-height);
  width: var(--range-handler-height);
  border-radius: 30%;
  border: var(--range-handler-border) solid var(--theme-fee-handler-outside);
  background-color: var(--theme-fee-handler-inside);
  position: relative;
  z-index: 30;
  box-shadow: 0 2px 12px var(--theme-fee-range-shadow);
}

.InputFee__currency-input-container {
  left: 0;
  top: -50%;
}

.InputFee__choices {
  right: 0;
  top: 0;
}

.InputFee__choice {
  margin-left: 0.3rem;
  margin-right: 0.2rem;
  transition: opacity 0.3s;
  @apply .text-theme-page-text-light
}
.InputFee__choice:hover {
  opacity: 0.5;
}
.InputFee__choice--active {
  @apply .rounded .bg-theme-button-special-choice .text-white .p-1
}
</style>