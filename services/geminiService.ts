
import { GoogleGenAI, Type } from "@google/genai";
import type { PCParts, TutorialResponse } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


const buildPrompt = (currentParts: PCParts, newParts: PCParts): string => {
  const changedParts = Object.keys(newParts)
    .filter(key => newParts[key as keyof PCParts] && newParts[key as keyof PCParts] !== currentParts[key as keyof PCParts])
    .join(', ');

  return `
You are an expert PC builder and technical writer. Your task is to generate a detailed, step-by-step guide for a user upgrading their PC. The user is upgrading the following components: ${changedParts}.

**Current PC Components:**
- CPU: ${currentParts.cpu || 'Not specified'}
- GPU: ${currentParts.gpu || 'Not specified'}
- RAM: ${currentParts.ram || 'Not specified'}
- Motherboard: ${currentParts.motherboard || 'Not specified'}
- Storage: ${currentParts.storage || 'Not specified'}
- PSU: ${currentParts.psu || 'Not specified'}
- OS: ${currentParts.os || 'Not specified'}

**New PC Components:**
- CPU: ${newParts.cpu || 'Not changing'}
- GPU: ${newParts.gpu || 'Not changing'}
- RAM: ${newParts.ram || 'Not changing'}
- Motherboard: ${newParts.motherboard || 'Not changing'}
- Storage: ${newParts.storage || 'Not changing'}
- PSU: ${newParts.psu || 'Not changing'}
- OS: ${newParts.os || 'Not changing'}

Based on this information, generate a clear, concise, and safe upgrade tutorial.

**Instructions for the guide:**
1.  First, analyze the component list for any obvious compatibility issues (e.g., new AMD CPU on an old Intel motherboard, DDR5 RAM with a DDR4 motherboard, inadequate PSU wattage for a new high-end GPU). List these issues in the 'warnings' field. If there are no issues, return an empty 'warnings' array.
2.  The tutorial should start with a "Preparation" section covering necessary tools (like screwdrivers, zip ties, anti-static wrist strap) and safety precautions (unplugging the PC, grounding yourself).
3.  Provide a logical sequence of steps for removing the old components and installing the new ones. ONLY create steps for components that are being changed.
4.  If the operating system is being changed or upgraded (e.g., from Windows 10 to 11, or a fresh install), include critical steps for **backing up personal data**, creating a **bootable USB installation drive**, and guidance on the OS installation process after the hardware is assembled.
5.  If the motherboard is being replaced, explain that this is a major overhaul and requires disconnecting everything and rebuilding.
6.  If the CPU is being replaced, include instructions on cleaning the old thermal paste and applying new paste.
7.  If the PSU is being replaced, emphasize cable management and connecting all required power leads to the motherboard, CPU, GPU, and other peripherals.
8.  Mention important details like releasing the PCIe retention clip for the GPU, the RAM retention clips, and connecting all necessary power and data cables (24-pin motherboard, 8-pin CPU, PCIe power for GPU, SATA cables).
9.  End with a "Final Checks" section covering cable management, closing the case, and the first boot-up process (including entering the BIOS/UEFI if necessary).
10. Keep the language clear and accessible for someone who may not be an expert.

Return the entire guide in the specified JSON format.
  `;
};

const schema = {
  type: Type.OBJECT,
  properties: {
    warnings: {
      type: Type.ARRAY,
      description: "A list of potential compatibility warnings or important notes before starting.",
      items: {
        type: Type.STRING
      }
    },
    tutorial: {
      type: Type.ARRAY,
      description: "An array of steps for the upgrade process.",
      items: {
        type: Type.OBJECT,
        properties: {
          step: {
            type: Type.INTEGER,
            description: "The step number."
          },
          title: {
            type: Type.STRING,
            description: "A concise title for the step."
          },
          details: {
            type: Type.STRING,
            description: "Detailed instructions for completing the step."
          }
        },
        required: ["step", "title", "details"]
      }
    }
  },
  required: ["warnings", "tutorial"]
};


export const generateUpgradeTutorial = async (currentParts: PCParts, newParts: PCParts): Promise<TutorialResponse> => {
  const prompt = buildPrompt(currentParts, newParts);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    
    // Basic validation
    if (!parsedJson.tutorial || !Array.isArray(parsedJson.tutorial)) {
        throw new Error("Invalid tutorial format in API response.");
    }

    return parsedJson as TutorialResponse;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate tutorial. The model may have returned an invalid format or an error occurred.");
  }
};