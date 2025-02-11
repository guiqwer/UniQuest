package com.Uniquest.UniQuest.dto.user;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ConfirmEmailChangeDTO (@JsonProperty("currentEmail") String currentEmail,
                                     @JsonProperty("code") String code,
                                     @JsonProperty("newEmail") String newEmail){
}
