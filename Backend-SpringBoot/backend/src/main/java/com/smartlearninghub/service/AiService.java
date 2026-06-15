package com.smartlearninghub.service;

import com.smartlearninghub.dto.ai.ChatRequest;
import com.smartlearninghub.dto.ai.ChatResponse;

public interface AiService {

    ChatResponse chat(ChatRequest request);
}
