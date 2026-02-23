// API service for Is This True? app

const API_BASE_URL = 'https://is-this-true-api.example.com'; // Replace with actual URL

export interface AnalysisResult {
  claim: string;
  percentage: number;
  summary: string;
  sources: string[];
}

export interface AnalyzeResponse {
  success: boolean;
  result?: AnalysisResult;
  error?: string;
}

export async function analyzeImage(imageBase64: string): Promise<AnalyzeResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageBase64,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// For demo/testing without backend
export async function analyzeImageMock(imageBase64: string): Promise<AnalyzeResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Return mock result
  return {
    success: true,
    result: {
      claim: 'Florida aliens discovered',
      percentage: Math.floor(Math.random() * 30), // Random 0-30%
      summary: 'No credible evidence found. This appears to be misinformation or a hoax.',
      sources: ['Reuters', 'Snopes', 'FactCheck.org'],
    },
  };
}
