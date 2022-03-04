import {
	Address,
} from '@graphprotocol/graph-ts'

import {
	Account,
	KRC20Contract,
	KRC20Balance,
	KRC20Approval,
} from '../../generated/schema'

import {
	IKRC20,
} from '../../generated/krc20/IKRC20'

import {
	constants,
} from '@amxx/graphprotocol-utils'

import {
	fetchAccount
} from './account'

export function fetchKRC20(address: Address): KRC20Contract {
	let account  = fetchAccount(address)
	let contract = KRC20Contract.load(account.id)

	if (contract == null) {
		let endpoint              = IKRC20.bind(address)
		let name                  = endpoint.try_name()
		let symbol                = endpoint.try_symbol()
		let decimals              = endpoint.try_decimals()
		contract                  = new KRC20Contract(account.id)

		// Common
		contract.name        = name.reverted     ? null : name.value
		contract.symbol      = symbol.reverted   ? null : symbol.value
		contract.decimals    = decimals.reverted ? 18   : decimals.value
		contract.totalSupply = fetchKRC20Balance(contract as KRC20Contract, null).id
		contract.asAccount   = account.id
		account.asKRC20      = contract.id
		contract.save()
		account.save()
	}

	return contract as KRC20Contract
}

export function fetchKRC20Balance(contract: KRC20Contract, account: Account | null): KRC20Balance {
	let id      = contract.id.concat('/').concat(account ? account.id : 'totalSupply')
	let balance = KRC20Balance.load(id)

	if (balance == null) {
		balance                 = new KRC20Balance(id)
		balance.contract        = contract.id
		balance.account         = account ? account.id : null
		balance.value           = constants.BIGDECIMAL_ZERO
		balance.valueExact      = constants.BIGINT_ZERO
		balance.save()
	}

	return balance as KRC20Balance
}

export function fetchKRC20Approval(contract: KRC20Contract, owner: Account, spender: Account): KRC20Approval {
	let id       = contract.id.concat('/').concat(owner.id).concat('/').concat(spender.id)
	let approval = KRC20Approval.load(id)

	if (approval == null) {
		approval                = new KRC20Approval(id)
		approval.contract       = contract.id
		approval.owner          = owner.id
		approval.spender        = spender.id
		approval.value          = constants.BIGDECIMAL_ZERO
		approval.valueExact     = constants.BIGINT_ZERO
	}

	return approval as KRC20Approval
}
