<template>
  <ListDivided
    class="TransactionConfirmSecondSignature"
    :is-floating-label="true"
  >
    <ListDividedItem
      class="TransactionConfirmSecondSignature__sender"
      :label="$t('TRANSACTION.SENDER')"
    >
      {{ senderLabel }}
      <span
        v-if="senderLabel !== currentWallet.address"
        class="text-sm text-theme-page-text-light"
      >
        {{ currentWallet.address }}
      </span>
    </ListDividedItem>
  </ListDivided>
</template>

<script>
import { TRANSACTION_TYPES } from '@config'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'

export default {
  name: 'TransactionConfirmSecondSignature',

  transactionType: TRANSACTION_TYPES.GROUP_1.SECOND_SIGNATURE,

  inject: ['currentWallet'],

  components: {
    ListDivided,
    ListDividedItem
  },

  computed: {
    senderLabel () {
      return this.wallet_formatAddress(this.currentWallet.address)
    }
  }
}
</script>
