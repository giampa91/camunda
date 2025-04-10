/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH under
 * one or more contributor license agreements. See the NOTICE file distributed
 * with this work for additional information regarding copyright ownership.
 * Licensed under the Camunda License 1.0. You may not use this file
 * except in compliance with the Camunda License 1.0.
 */

import {ProcessDefinitionStatistic} from '@vzeta/camunda-api-zod-schemas/operate';
import {isProcessEndEvent} from 'modules/bpmn-js/utils/isProcessEndEvent';
import {modificationsStore} from 'modules/stores/modifications';
import {processInstanceDetailsDiagramStore} from 'modules/stores/processInstanceDetailsDiagram';

type Statistic = ProcessDefinitionStatistic & {
  filteredActive: number;
  completedEndEvents: number;
};

const getStatisticsByFlowNode = (data: ProcessDefinitionStatistic[]) => {
  return data.reduce<{
    [key: string]: Omit<Statistic, 'flowNodeId'>;
  }>((statistics, {flowNodeId: id, active, incidents, completed, canceled}) => {
    // TODO: [OPERATE-V2-MIGRATION] After migrating processInstanceDetailsDiagramStore to a query,
    // consider passing the resolved flowNode as a parameter to getStatisticsByFlowNode
    // instead of accessing it directly from processInstanceDetailsDiagramStore.businessObjects.
    const businessObject =
      processInstanceDetailsDiagramStore.businessObjects[id];

    if (businessObject === undefined) {
      return statistics;
    }

    statistics[id] = {
      active,
      filteredActive: businessObject?.$type !== 'bpmn:SubProcess' ? active : 0,
      incidents,
      completed: !isProcessEndEvent(businessObject) ? completed : 0,
      completedEndEvents: isProcessEndEvent(businessObject) ? completed : 0,
      canceled,
      ...(modificationsStore.isModificationModeEnabled
        ? {
            completed: 0,
            completedEndEvents: 0,
            canceled: 0,
          }
        : {}),
    };

    return statistics;
  }, {});
};

export {getStatisticsByFlowNode};
