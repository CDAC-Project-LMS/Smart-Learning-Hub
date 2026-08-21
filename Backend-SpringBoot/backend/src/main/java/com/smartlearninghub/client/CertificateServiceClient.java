package com.smartlearninghub.client;

import com.smartlearninghub.dto.certificate.CertificateGenerationRequest;
import com.smartlearninghub.dto.certificate.CertificateGenerationResponse;
import com.smartlearninghub.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;


@Component
@Slf4j
public class CertificateServiceClient {


    private final WebClient webClient;


    public CertificateServiceClient(
            WebClient.Builder webClientBuilder,
            @Value("${app.certificate-service.base-url}") String baseUrl) {


        log.info("Certificate Service URL : {}", baseUrl);

        this.webClient =
                webClientBuilder
                        .baseUrl(baseUrl)
                        .build();
    }




    public CertificateGenerationResponse generateCertificate(
            CertificateGenerationRequest request) {


        log.info(
                "Calling .NET Certificate Service. Student={}, Course={}",
                request.getStudentId(),
                request.getCourseId()
        );


        try {


            CertificateGenerationResponse response =
                    webClient.post()

                            .uri("/certificates/generate")

                            .bodyValue(request)

                            .retrieve()

                            .bodyToMono(
                                    CertificateGenerationResponse.class
                            )

                            .block();



            if(response == null){

                throw new BadRequestException(
                        "Empty response from certificate service"
                );
            }



            log.info(
                    "Certificate generated successfully. Number={}",
                    response.getCertificateNumber()
            );


            return response;



        }
        catch(WebClientResponseException e){


            log.error(
                    "Certificate Service HTTP Error. Status={}, Body={}",
                    e.getStatusCode(),
                    e.getResponseBodyAsString()
            );


            throw new BadRequestException(
                    "Certificate service returned error : "
                    + e.getStatusCode()
            );

        }
        catch(Exception e){


            log.error(
                    "Certificate Service Connection Failed",
                    e
            );


            throw new BadRequestException(
                    "Certificate generation service is unavailable"
            );
        }
    }
}