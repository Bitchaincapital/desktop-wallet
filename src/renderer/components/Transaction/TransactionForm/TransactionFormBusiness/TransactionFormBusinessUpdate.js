import { TRANSACTION_GROUPS, TRANSACTION_TYPES } from '@config'
import mixin from './mixin'

export default {
  name: 'TransactionFormBusinessUpdate',

  transactionGroup: TRANSACTION_GROUPS.MAGISTRATE,

  transactionType: TRANSACTION_TYPES.GROUP_2.BUSINESS_UPDATE,

  mixins: [mixin],

  props: {
    isUpdate: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: (vm) => ({
    form: {
      fee: 0,
      passphrase: '',
      walletPassword: '',
      asset: {
        name: vm.wallet_fromRoute.business.name,
        website: vm.wallet_fromRoute.business.website,
        vat: vm.wallet_fromRoute.business.vat,
        repository: vm.wallet_fromRoute.business.repository
      }
    }
  }),

  methods: {
    async buildTransaction (transactionData, isAdvancedFee = false, returnObject = false) {
      return this.$client.buildBusinessUpdate(transactionData, isAdvancedFee, returnObject)
    },

    transactionError () {
      this.$error(this.$t('TRANSACTION.ERROR.VALIDATION.BUSINESS_UPDATE'))
    }
  }
}
