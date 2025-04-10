/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH under
 * one or more contributor license agreements. See the NOTICE file distributed
 * with this work for additional information regarding copyright ownership.
 * Licensed under the Camunda License 1.0. You may not use this file
 * except in compliance with the Camunda License 1.0.
 */
package io.camunda.optimize.dto.optimize.query.alert;

import com.fasterxml.jackson.annotation.JsonValue;
import java.util.Locale;

public enum AlertIntervalUnit {
  SECONDS,
  MINUTES,
  HOURS,
  DAYS,
  WEEKS,
  MONTHS;

  @JsonValue
  public String getId() {
    return name().toLowerCase(Locale.ENGLISH);
  }
}
