# Flight Booking System - Frontend Integration Guide

This document outlines the necessary information for frontend developers to integrate with the backend's flight booking engine.

## 1. Overview

The flight booking engine operates as a multi-agent orchestration system. A single API endpoint handles the entire flight booking workflow, from interpreting natural language requests to confirming and booking flights.

## 2. Endpoint Details

- **URL:** `/api/flight-booking`
- **Method:** `POST`
- **Full Example URL (Development):** `http://localhost:5000/api/flight-booking` (assuming backend runs on port 5000)

## 3. Request Body Structure

The request body must be a JSON object containing two primary fields:

- `text` (string, **required**): A natural language query describing the flight request. This text is used by the backend's Travel Request Agent to extract flight parameters (origin, destination, dates, number of adults, etc.).
  - **Example:** `"I want to book a flight from New York to London on August 15th, 2025, returning on August 20th, 2025 for 2 adults."`
- `travelers` (array of objects, **required**): An array where each object represents a single traveler with their complete personal and contact details.

**Important:** The number of `traveler` objects in the `travelers` array **must exactly match** the number of adults specified in the `text` input. The backend performs validation for this.

### `traveler` Object Structure

Each object within the `travelers` array must adhere to the following structure. All fields are **required** unless otherwise specified.

```json
{
  "dateOfBirth": "YYYY-MM-DD",
  "name": {
    "firstName": "STRING",
    "lastName": "STRING"
  },
  "gender": "MALE" | "FEMALE" | "OTHER", // Use "MALE", "FEMALE", or "OTHER"
  "contact": {
    "emailAddress": "STRING (email format)",
    "phones": [
      {
        "deviceType": "MOBILE" | "LANDLINE", // "MOBILE" or "LANDLINE"
        "countryCallingCode": "STRING (e.g., '1' for USA)",
        "number": "STRING (phone number)"
      }
    ]
  },
  "documents": [
    {
      "documentType": "PASSPORT" | "NATIONAL_ID" | "VISA" | "OTHER", // e.g., "PASSPORT"
      "birthPlace": "STRING (City)",
      "issuanceLocation": "STRING (City)",
      "issuanceDate": "YYYY-MM-DD",
      "number": "STRING (Document Number)",
      "expiryDate": "YYYY-MM-DD",
      "issuanceCountry": "STRING (2-letter ISO country code, e.g., 'US')",
      "validityCountry": "STRING (2-letter ISO country code, e.g., 'US')",
      "nationality": "STRING (2-letter ISO country code, e.g., 'US')",
      "holder": true // Must be true for the primary holder of the document
    }
  ]
}
```

**Example Full Request Body:**

```json
{
  "text": "I want to book a flight from New York to London on August 15th, 2025, returning on August 20th, 2025 for 2 adults.",
  "travelers": [
    {
      "dateOfBirth": "1990-01-01",
      "name": {
        "firstName": "JOHN",
        "lastName": "DOE"
      },
      "gender": "MALE",
      "contact": {
        "emailAddress": "john.doe@example.com",
        "phones": [
          {
            "deviceType": "MOBILE",
            "countryCallingCode": "1",
            "number": "5551234567"
          }
        ]
      },
      "documents": [
        {
          "documentType": "PASSPORT",
          "birthPlace": "MADRID",
          "issuanceLocation": "MADRID",
          "issuanceDate": "2018-04-14",
          "number": "00000000",
          "expiryDate": "2028-04-14",
          "issuanceCountry": "ES",
          "validityCountry": "ES",
          "nationality": "ES",
          "holder": true
        }
      ]
    },
    {
      "dateOfBirth": "1992-05-20",
      "name": {
        "firstName": "JANE",
        "lastName": "SMITH"
      },
      "gender": "FEMALE",
      "contact": {
        "emailAddress": "jane.smith@example.com",
        "phones": [
          {
            "deviceType": "MOBILE",
            "countryCallingCode": "1",
            "number": "5559876543"
          }
        ]
      },
      "documents": [
        {
          "documentType": "PASSPORT",
          "birthPlace": "LONDON",
          "issuanceLocation": "LONDON",
          "issuanceDate": "2019-03-10",
          "number": "11111111",
          "expiryDate": "2029-03-10",
          "issuanceCountry": "GB",
          "validityCountry": "GB",
          "nationality": "GB",
          "holder": true
        }
      ]
    }
  ]
}
```

## 4. Successful Response (HTTP 200 OK)

Upon successful flight booking, the backend will return a `200 OK` status with a JSON body containing the booking confirmation details.

```json
{
  "message": "Flight booking completed successfully through multi-agent orchestration!",
  "bookingConfirmation": {
    "data": {
      "type": "flight-order",
      "id": "...", // Amadeus Order ID
      "queuingOfficeId": "...",
      "associatedRecords": [
        {
          "reference": "ABCDEF", // **Crucial: This is the PNR (Record Locator)**
          "creationDate": "YYYY-MM-DDTHH:MM:SS.000",
          "originSystemCode": "GDS",
          "flightOfferId": "1"
        }
      ],
      "flightOffers": [
        {
          // ... detailed flight offer information (itineraries, price, etc.) ...
        }
      ],
      "travelers": [
        {
          // ... details of booked travelers, including Amadeus-assigned IDs ...
        }
      ],
      "ticketingAgreement": {
        "option": "CONFIRM"
      },
      "automatedProcess": [
        {
          "code": "IMMEDIATE",
          "queue": {
            "number": "0",
            "category": "0"
          },
          "officeId": "..."
        }
      ]
    },
    "dictionaries": {
      // ... IATA code to city/country mappings ...
    }
  },
  "originalTravelRequest": {
    // ... parsed travel request details from the initial text input ...
  }
}
```

**Example Full Output Response:**

```json
{
  "message": "Flight booking completed successfully through multi-agent orchestration!",
  "bookingConfirmation": {
    "data": {
      "type": "flight-order",
      "id": "eJzTd9e38IiM8ggBAAs%2FAnU%3D",
      "queuingOfficeId": "NCE4D31SB",
      "associatedRecords": [
        {
          "reference": "8HYZHT",
          "creationDate": "2025-07-02T12:12:00.000",
          "originSystemCode": "GDS",
          "flightOfferId": "1"
        }
      ],
      "flightOffers": [
        {
          "type": "flight-offer",
          "id": "1",
          "source": "GDS",
          "nonHomogeneous": false,
          "lastTicketingDate": "2025-07-05",
          "itineraries": [
            {
              "segments": [
                {
                  "departure": {
                    "iataCode": "JFK",
                    "terminal": "7",
                    "at": "2025-07-15T09:00:00"
                  },
                  "arrival": {
                    "iataCode": "YUL",
                    "at": "2025-07-15T10:36:00"
                  },
                  "carrierCode": "AC",
                  "number": "8899",
                  "aircraft": {
                    "code": "E75"
                  },
                  "operating": {},
                  "duration": "PT1H36M",
                  "id": "3",
                  "numberOfStops": 0,
                  "co2Emissions": [
                    {
                      "weight": 97,
                      "weightUnit": "KG",
                      "cabin": "ECONOMY"
                    }
                  ]
                },
                {
                  "departure": {
                    "iataCode": "YUL",
                    "at": "2025-07-15T18:55:00"
                  },
                  "arrival": {
                    "iataCode": "LHR",
                    "terminal": "2",
                    "at": "2025-07-16T06:30:00"
                  },
                  "carrierCode": "AC",
                  "number": "866",
                  "aircraft": {
                    "code": "789"
                  },
                  "operating": {},
                  "duration": "PT6H35M",
                  "id": "4",
                  "numberOfStops": 0,
                  "co2Emissions": [
                    {
                      "weight": 261,
                      "weightUnit": "KG",
                      "cabin": "ECONOMY"
                    }
                  ]
                }
              ]
            },
            {
              "segments": [
                {
                  "departure": {
                    "iataCode": "LHR",
                    "terminal": "2",
                    "at": "2025-07-20T09:30:00"
                  },
                  "arrival": {
                    "iataCode": "YUL",
                    "at": "2025-07-20T11:40:00"
                  },
                  "carrierCode": "AC",
                  "number": "867",
                  "aircraft": {
                    "code": "789"
                  },
                  "operating": {},
                  "duration": "PT7H10M",
                  "id": "13",
                  "numberOfStops": 0,
                  "co2Emissions": [
                    {
                      "weight": 261,
                      "weightUnit": "KG",
                      "cabin": "ECONOMY"
                    }
                  ]
                },
                {
                  "departure": {
                    "iataCode": "YUL",
                    "at": "2025-07-20T19:30:00"
                  },
                  "arrival": {
                    "iataCode": "JFK",
                    "terminal": "7",
                    "at": "2025-07-20T21:17:00"
                  },
                  "carrierCode": "AC",
                  "number": "8898",
                  "aircraft": {
                    "code": "E75"
                  },
                  "operating": {},
                  "duration": "PT1H47M",
                  "id": "14",
                  "numberOfStops": 0,
                  "co2Emissions": [
                    {
                      "weight": 97,
                      "weightUnit": "KG",
                      "cabin": "ECONOMY"
                    }
                  ]
                }
              ]
            }
          ],
          "price": {
            "currency": "EUR",
            "total": "1015.98",
            "base": "130.00",
            "fees": [
              {
                "amount": "0.00",
                "type": "TICKETING"
              },
              {
                "amount": "0.00",
                "type": "SUPPLIER"
              },
              {
                "amount": "0.00",
                "type": "FORM_OF_PAYMENT"
              }
            ],
            "grandTotal": "1015.98",
            "billingCurrency": "EUR"
          },
          "pricingOptions": {
            "fareType": ["PUBLISHED"],
            "includedCheckedBagsOnly": false
          },
          "validatingAirlineCodes": ["AC"],
          "travelerPricings": [
            {
              "travelerId": "1",
              "fareOption": "STANDARD",
              "travelerType": "ADULT",
              "price": {
                "currency": "EUR",
                "total": "507.99",
                "base": "65.00",
                "taxes": [
                  {
                    "amount": "4.79",
                    "code": "AY"
                  },
                  {
                    "amount": "105.57",
                    "code": "GB"
                  },
                  {
                    "amount": "60.67",
                    "code": "UB"
                  },
                  {
                    "amount": "39.14",
                    "code": "US"
                  },
                  {
                    "amount": "3.17",
                    "code": "XA"
                  },
                  {
                    "amount": "3.85",
                    "code": "XF"
                  },
                  {
                    "amount": "5.99",
                    "code": "XY"
                  },
                  {
                    "amount": "6.16",
                    "code": "YC"
                  },
                  {
                    "amount": "213.65",
                    "code": "YQ"
                  }
                ],
                "refundableTaxes": "186.35"
              },
              "fareDetailsBySegment": [
                {
                  "segmentId": "3",
                  "cabin": "ECONOMY",
                  "fareBasis": "LKA03LGT",
                  "brandedFare": "BASIC",
                  "class": "L",
                  "includedCheckedBags": {
                    "quantity": 0
                  }
                },
                {
                  "segmentId": "4",
                  "cabin": "ECONOMY",
                  "fareBasis": "LKA03LGT",
                  "brandedFare": "BASIC",
                  "class": "L",
                  "includedCheckedBags": {
                    "quantity": 0
                  }
                },
                {
                  "segmentId": "13",
                  "cabin": "ECONOMY",
                  "fareBasis": "LHA06LGT",
                  "brandedFare": "BASIC",
                  "class": "L",
                  "includedCheckedBags": {
                    "quantity": 0
                  }
                },
                {
                  "segmentId": "14",
                  "cabin": "ECONOMY",
                  "fareBasis": "LHA06LGT",
                  "brandedFare": "BASIC",
                  "class": "L",
                  "includedCheckedBags": {
                    "quantity": 0
                  }
                }
              ]
            },
            {
              "travelerId": "2",
              "fareOption": "STANDARD",
              "travelerType": "ADULT",
              "price": {
                "currency": "EUR",
                "total": "507.99",
                "base": "65.00",
                "taxes": [
                  {
                    "amount": "4.79",
                    "code": "AY"
                  },
                  {
                    "amount": "105.57",
                    "code": "GB"
                  },
                  {
                    "amount": "60.67",
                    "code": "UB"
                  },
                  {
                    "amount": "39.14",
                    "code": "US"
                  },
                  {
                    "amount": "3.17",
                    "code": "XA"
                  },
                  {
                    "amount": "3.85",
                    "code": "XF"
                  },
                  {
                    "amount": "5.99",
                    "code": "XY"
                  },
                  {
                    "amount": "6.16",
                    "code": "YC"
                  },
                  {
                    "amount": "213.65",
                    "code": "YQ"
                  }
                ],
                "refundableTaxes": "186.35"
              },
              "fareDetailsBySegment": [
                {
                  "segmentId": "3",
                  "cabin": "ECONOMY",
                  "fareBasis": "LKA03LGT",
                  "brandedFare": "BASIC",
                  "class": "L",
                  "includedCheckedBags": {
                    "quantity": 0
                  }
                },
                {
                  "segmentId": "4",
                  "cabin": "ECONOMY",
                  "fareBasis": "LKA03LGT",
                  "brandedFare": "BASIC",
                  "class": "L",
                  "includedCheckedBags": {
                    "quantity": 0
                  }
                },
                {
                  "segmentId": "13",
                  "cabin": "ECONOMY",
                  "fareBasis": "LHA06LGT",
                  "brandedFare": "BASIC",
                  "class": "L",
                  "includedCheckedBags": {
                    "quantity": 0
                  }
                },
                {
                  "segmentId": "14",
                  "cabin": "ECONOMY",
                  "fareBasis": "LHA06LGT",
                  "brandedFare": "BASIC",
                  "class": "L",
                  "includedCheckedBags": {
                    "quantity": 0
                  }
                }
              ]
            }
          ]
        }
      ],
      "travelers": [
        {
          "id": "1",
          "dateOfBirth": "1990-01-01",
          "gender": "MALE",
          "name": {
            "firstName": "JOHN",
            "lastName": "DOE"
          },
          "documents": [
            {
              "number": "00000000",
              "issuanceDate": "2018-04-14",
              "expiryDate": "2028-04-14",
              "issuanceCountry": "ES",
              "issuanceLocation": "MADRID",
              "nationality": "ES",
              "birthPlace": "MADRID",
              "documentType": "PASSPORT",
              "holder": true
            }
          ],
          "contact": {
            "purpose": "STANDARD",
            "phones": [
              {
                "deviceType": "MOBILE",
                "countryCallingCode": "1",
                "number": "5551234567"
              }
            ],
            "emailAddress": "john.doe@example.com"
          }
        },
        {
          "id": "2",
          "dateOfBirth": "1992-05-20",
          "gender": "FEMALE",
          "name": {
            "firstName": "JANE",
            "lastName": "SMITH"
          },
          "documents": [
            {
              "number": "11111111",
              "issuanceDate": "2019-03-10",
              "expiryDate": "2029-03-10",
              "issuanceCountry": "GB",
              "issuanceLocation": "LONDON",
              "nationality": "GB",
              "birthPlace": "LONDON",
              "documentType": "PASSPORT",
              "holder": true
            }
          ],
          "contact": {
            "purpose": "STANDARD",
            "phones": [
              {
                "deviceType": "MOBILE",
                "countryCallingCode": "1",
                "number": "5559876543"
              }
            ],
            "emailAddress": "jane.smith@example.com"
          }
        }
      ],
      "ticketingAgreement": {
        "option": "CONFIRM"
      },
      "automatedProcess": [
        {
          "code": "IMMEDIATE",
          "queue": {
            "number": "0",
            "category": "0"
          },
          "officeId": "NCE4D31SB"
        }
      ]
    },
    "dictionaries": {
      "locations": {
        "YUL": {
          "cityCode": "YMQ",
          "countryCode": "CA"
        },
        "LHR": {
          "cityCode": "LON",
          "countryCode": "GB"
        },
        "JFK": {
          "cityCode": "NYC",
          "countryCode": "US"
        }
      }
    }
  },
  "originalTravelRequest": {
    "flight": {
      "origin": "JFK",
      "destination": "LHR",
      "departureDate": "2025-07-15",
      "returnDate": "2025-07-20",
      "adults": 2,
      "children": 0,
      "travelClass": "ECONOMY",
      "preferences": null
    },
    "hotel": null,
    "activities": null
  }
}
```

**Key Information for Frontend:**

- **PNR (Record Locator):** `response.bookingConfirmation.data.associatedRecords[0].reference` - This is the most important piece of information for the user to manage their booking.
- **Flight Details:** `response.bookingConfirmation.data.flightOffers` - Contains all the itinerary details (flights, times, airports, etc.).
- **Booked Travelers:** `response.bookingConfirmation.data.travelers` - Confirms the details of the travelers who were booked.

## 5. Error Handling

The backend provides specific error messages to help the frontend inform the user. Frontend should handle different HTTP status codes and parse the `message` field in the response.

### Common Error Responses (HTTP 400 Bad Request)

- **Missing `text` or `travelers`:**
  ```json
  {
    "message": "User input text is required to generate an itinerary."
  }
  ```
  or
  ```json
  {
    "message": "Traveler data (array of traveler objects) is required for booking."
  }
  ```
- **Mismatched Traveler Count:**
  ```json
  {
    "message": "Number of travelers provided (X) does not match the number of adults in the request (Y)."
  }
  ```
  (Where X is `travelers.length` and Y is `travelRequest.flight.adults`)

### Backend/Amadeus API Errors (HTTP 500 Internal Server Error)

These errors indicate issues during the orchestration process or with the external Amadeus API.

- **Flight No Longer Available (`SEGMENT SELL FAILURE`):**

  ```json
  {
    "message": "The selected flight or a segment of it is no longer available for booking. This might be due to a change in price or seat availability. Please try searching for flights again.",
    "details": "Amadeus API Error (Book Flight): 400 - {"errors":[{"status":400,"code":34651,"title":"SEGMENT SELL FAILURE","detail":"Could not sell segment 3","source":{"pointer":"/data/flightOffers[0]/itineraries[1]/segments[0]"}}]}"
  }
  ```

  **Frontend Action:** Display the `message` to the user and suggest they search for flights again.

- **Other Amadeus API Errors:**

  ```json
  {
    "message": "Failed to book flight.",
    "details": "Amadeus API Error (Book Flight): <HTTP_STATUS_CODE> - <AMADEUS_ERROR_DETAILS_JSON>"
  }
  ```

  **Frontend Action:** Display a generic error message to the user and suggest contacting support if the issue persists. The `details` field can be logged for debugging.

- **General Internal Errors:**
  ```json
  {
    "message": "Failed to process travel request.",
    "details": "Error message from backend"
  }
  ```
  **Frontend Action:** Display a generic error message. The `details` field is for backend debugging.
