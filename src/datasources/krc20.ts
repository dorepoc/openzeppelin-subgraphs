import {
	KRC20Transfer,
} from '../../generated/schema'

import {
	Transfer as TransferEvent,
	Approval as ApprovalEvent,
} from '../../generated/krc20/IKRC20'

import {
	constants,
	decimals,
	events,
	transactions,
} from '@amxx/graphprotocol-utils'

import {
	fetchAccount,
} from '../fetch/account'

import {
	fetchKRC20,
	fetchKRC20Balance,
	fetchKRC20Approval,
} from '../fetch/krc20'

export function handleTransfer(event: TransferEvent): void {
	let contract   = fetchKRC20(event.address)
	let ev         = new KRC20Transfer(events.id(event))
	ev.emitter     = contract.id
	ev.transaction = transactions.log(event).id
	ev.timestamp   = event.block.timestamp
	ev.contract    = contract.id
	ev.value       = decimals.toDecimals(event.params.value, contract.decimals)
	ev.valueExact  = event.params.value

	if (event.params.from.toHex() == constants.ADDRESS_ZERO) {
		let totalSupply        = fetchKRC20Balance(contract, null)
		totalSupply.valueExact = totalSupply.valueExact.plus(event.params.value)
		totalSupply.value      = decimals.toDecimals(totalSupply.valueExact, contract.decimals)
		totalSupply.save()
	} else {
		let from               = fetchAccount(event.params.from)
		let balance            = fetchKRC20Balance(contract, from)
		balance.valueExact     = balance.valueExact.minus(event.params.value)
		balance.value          = decimals.toDecimals(balance.valueExact, contract.decimals)
		balance.save()

		ev.from                = from.id
		ev.fromBalance         = balance.id
	}

	if (event.params.to.toHex() == constants.ADDRESS_ZERO) {
		let totalSupply        = fetchKRC20Balance(contract, null)
		totalSupply.valueExact = totalSupply.valueExact.minus(event.params.value)
		totalSupply.value      = decimals.toDecimals(totalSupply.valueExact, contract.decimals)
		totalSupply.save()
	} else {
		let to                 = fetchAccount(event.params.to)
		let balance            = fetchKRC20Balance(contract, to)
		balance.valueExact     = balance.valueExact.plus(event.params.value)
		balance.value          = decimals.toDecimals(balance.valueExact, contract.decimals)
		balance.save()

		ev.to                  = to.id
		ev.toBalance           = balance.id
	}
	ev.save()
}

export function handleApproval(event: ApprovalEvent): void {
	let contract = fetchKRC20(event.address)

	let owner           = fetchAccount(event.params.owner)
	let spender         = fetchAccount(event.params.spender)
	let approval        = fetchKRC20Approval(contract, owner, spender)
	approval.valueExact = event.params.value
	approval.value      = decimals.toDecimals(event.params.value, contract.decimals)
	approval.save()

	// let ev         = new KRC20ApprovalEvent(events.id(event))
	// ev.emitter     = contract.id
	// ev.transaction = transactions.log(event).id
	// ev.timestamp   = event.block.timestamp
	// ev.token       = token.id
	// ev.owner       = owner.id
	// ev.spender     = spender.id
	// ev.approval    = approval.id
	// ev.value       = value.value
	// ev.save()
}
