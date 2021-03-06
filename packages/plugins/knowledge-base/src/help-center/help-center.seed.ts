import { IHelpCenter } from '@gauzy/contracts';
import { Connection } from 'typeorm';
import { HelpCenter } from './help-center.entity';
import { DEFAULT_HELP_CENTER_MENUS } from './default-help-centers';
import { Organization, Tenant } from '@gauzy/core';

export const createHelpCenter = async (
	connection: Connection,
	{
		tenant,
		org
	}: {
		tenant: Tenant;
		org: Organization;
	}
): Promise<IHelpCenter[]> => {
	const helpCenterMenuList: IHelpCenter[] = DEFAULT_HELP_CENTER_MENUS;
	for (const node of helpCenterMenuList) {
		const helpCenter: IHelpCenter = {
			...node,
			tenant,
			organization: org
		};
		helpCenter.children.forEach((child: HelpCenter) => {
			child.organization = org;
			child.tenant = tenant;
		});
		const entity = await createEntity(connection, helpCenter);
		await connection.manager.save(entity);
	}
	return helpCenterMenuList;
};

const createEntity = async (connection: Connection, node: HelpCenter) => {
	if (!node) {
		return;
	}
	return connection.manager.create(HelpCenter, node);
};
