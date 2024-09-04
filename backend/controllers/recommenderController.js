import { HfInference } from "@huggingface/inference";
import UserData from "../models/userData.js";
import dotenv from "dotenv";
dotenv.config();

// backend using huggingFace

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export const analyzeData = async (req, res) => {
  try {
    const { recommendation, culinary, medicinal, cosmetic, pregnantWomen } = req.body;
    const { useCases } = recommendation;

    if (!useCases || !Array.isArray(useCases)) {
      return res.status(400).json({ error: "Invalid or missing useCases" });
    }

    // Extract user data from the request
    const user = req.body;
    console.log(user);
    if (!user || !user.id || !user.name || !user.email) {
      return res.status(400).json({ error: "User information is missing" });
    }

    // Process data to match schema expectations
    const userData = new UserData({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "user", // Default to "user" if role is not provided
      },
      recommendation: {
        useCases: Array.isArray(req.body.recommendation?.useCases)
          ? req.body.recommendation.useCases
          : [],
      },
      culinary: {
        cuisine: req.body.cuisine || "",
        dishes: Array.isArray(req.body.dishes)
          ? req.body.dishes
          : [req.body.dishes], // Ensure dishes is an array
        flavor: req.body.flavor || "",
        healthBenefits: Array.isArray(req.body.healthBenefits)
          ? req.body.healthBenefits
          : [req.body.healthBenefits], // Ensure healthBenefits is an array
        healthConditions: Array.isArray(req.body.healthConditions)
          ? req.body.healthConditions
          : [req.body.healthConditions], // Ensure healthConditions is an array
        learnTechniques: req.body.learnTechniques || "",
      },
      medicinal: {
        medications: req.body.medications || "",
        benefits: Array.isArray(req.body.benefits)
          ? req.body.benefits
          : [req.body.benefits], // Ensure benefits is an array
        consultedProvider: Array.isArray(req.body.consultedProvider)
          ? req.body.consultedProvider[0]
          : "", // Extract if array
        concerns: req.body.concerns || "",
      },
      cosmetic: {
        skinType: req.body.skinType || "",
        skinConcerns: Array.isArray(req.body.skinConcerns)
          ? req.body.skinConcerns
          : [req.body.skinConcerns], // Ensure skinConcerns is an array
        applicationFrequency: req.body.applicationFrequency || "",
        usedSaffron: req.body.usedSaffron || "", // Ensure usedSaffron is a string
      },
      pregnantWomen: {
        pregnancyStage: req.body.pregnancyStage || "",
        usedBeforePregnancy: req.body.usedBeforePregnancy || "", // Extract if array
        usingDuringPregnancy: req.body.usingDuringPregnancy || "", // Extract if array
        knownAllergies: req.body.knownAllergies || "",
      },
    });

    // Save the data
    await userData.save();

    // Collect all relevant data for each use case
    const collectedData = [];
    useCases.forEach((useCase) => {
      switch (useCase) {
        case "culinary":
          if (culinary) {
            const {
              cuisine,
              dishes,
              flavor,
              healthBenefits,
              healthConditions,
            } = culinary;
            collectedData.push(
              `Cuisine: ${cuisine}, Dishes: ${dishes}, Flavor: ${flavor}, Health benefits: ${healthBenefits}, Health conditions: ${healthConditions}`
            );
          }
          break;
        case "cosmetic":
          if (cosmetic) {
            const {
              skinType,
              skinConcerns,
              applicationFrequency,
              usedSaffron,
            } = cosmetic;
            collectedData.push(
              `Skin type: ${skinType}, Skin concerns: ${skinConcerns}, Application frequency: ${applicationFrequency}, Used saffron before: ${usedSaffron}`
            );
          }
          break;
        case "medicinal":
          if (medicinal) {
            const { medications, benefits, consultedProvider, concerns } =
              medicinal;
            collectedData.push(
              `Medications: ${medications}, Benefits: ${benefits}, Consulted healthcare provider: ${consultedProvider}, Concerns: ${concerns}`
            );
          }
          break;
        case "pregnantwomen":
          if (pregnantWomen) {
            const {
              pregnancyStage,
              usedBeforePregnancy,
              usingDuringPregnancy,
              knownAllergies,
            } = pregnantWomen;
            collectedData.push(
              `Pregnancy stage: ${pregnancyStage}, Used before pregnancy: ${usedBeforePregnancy}, Using during pregnancy: ${usingDuringPregnancy}, Known allergies: ${knownAllergies}`
            );
          }
          break;
        default:
          break;
      }
    });

    // Construct the prompt for the AI model
    const prompt = `Based on the following use cases: ${useCases.join(", ")} and details: ${collectedData.join(  " | ")}, recommend either Kashmiri or Spanish saffron. Choose only one option and provide a brief explanation with 3 to 4 positive points about why it is the best choice for the given use cases. Avoid providing details for the non-recommended option.
    {
      "title": "Recommended Saffron Type",
      "suggestion": "Explanation"
    }`;

    // Call the Hugging Face model
    const result = await hf.textGeneration({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      inputs: prompt,
      parameters: {
        max_new_tokens: 400,
        return_full_text: false,
      },
    });

    const suggestion = result.generated_text;

    // Send only the model's suggestion back to the frontend
    res.json({ suggestion });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};