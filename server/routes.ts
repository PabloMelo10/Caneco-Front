import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertProductSchema, 
  insertCategorySchema, 
  insertSaleSchema, 
  insertCashTransactionSchema,
  insertDailyRegisterSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // In a real application, we would use proper session management and hashed passwords
      return res.status(200).json({ 
        id: user.id,
        username: user.username,
        name: user.name,
        isAdmin: user.isAdmin
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Categories routes
  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      return res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategory(id);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      return res.status(200).json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/categories", async (req: Request, res: Response) => {
    try {
      const parsedData = insertCategorySchema.safeParse(req.body);
      
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid category data", errors: parsedData.error });
      }
      
      const newCategory = await storage.createCategory(parsedData.data);
      return res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error creating category:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Products routes
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      let products;
      
      if (req.query.categoryId) {
        const categoryId = parseInt(req.query.categoryId as string);
        console.log("Fetching products for category:", categoryId);
        products = await storage.getProductsByCategory(categoryId);
        console.log("Found products:", products.length);
      } else {
        products = await storage.getProducts();
      }
      
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      return res.status(200).json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/products", async (req: Request, res: Response) => {
    try {
      const parsedData = insertProductSchema.safeParse(req.body);
      
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid product data", errors: parsedData.error });
      }
      
      const newProduct = await storage.createProduct(parsedData.data);
      return res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error creating product:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Sales routes
  app.get("/api/sales", async (req: Request, res: Response) => {
    try {
      let sales;
      
      if (req.query.startDate && req.query.endDate) {
        const startDate = new Date(req.query.startDate as string);
        const endDate = new Date(req.query.endDate as string);
        sales = await storage.getSalesByDateRange(startDate, endDate);
      } else {
        sales = await storage.getSales();
      }
      
      return res.status(200).json(sales);
    } catch (error) {
      console.error("Error fetching sales:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/sales/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const sale = await storage.getSale(id);
      
      if (!sale) {
        return res.status(404).json({ message: "Sale not found" });
      }
      
      return res.status(200).json(sale);
    } catch (error) {
      console.error("Error fetching sale:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/sales", async (req: Request, res: Response) => {
    try {
      const parsedData = insertSaleSchema.safeParse(req.body);
      
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid sale data", errors: parsedData.error });
      }
      
      const newSale = await storage.createSale(parsedData.data);
      return res.status(201).json(newSale);
    } catch (error) {
      console.error("Error creating sale:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Cash transactions routes
  app.get("/api/cash-transactions", async (req: Request, res: Response) => {
    try {
      let transactions;
      
      if (req.query.startDate && req.query.endDate) {
        const startDate = new Date(req.query.startDate as string);
        const endDate = new Date(req.query.endDate as string);
        transactions = await storage.getCashTransactionsByDateRange(startDate, endDate);
      } else {
        transactions = await storage.getCashTransactions();
      }
      
      return res.status(200).json(transactions);
    } catch (error) {
      console.error("Error fetching cash transactions:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/cash-transactions", async (req: Request, res: Response) => {
    try {
      const parsedData = insertCashTransactionSchema.safeParse(req.body);
      
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid cash transaction data", errors: parsedData.error });
      }
      
      const newTransaction = await storage.createCashTransaction(parsedData.data);
      return res.status(201).json(newTransaction);
    } catch (error) {
      console.error("Error creating cash transaction:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Daily register routes
  app.get("/api/daily-registers", async (req: Request, res: Response) => {
    try {
      let registers;
      
      if (req.query.startDate && req.query.endDate) {
        const startDate = new Date(req.query.startDate as string);
        const endDate = new Date(req.query.endDate as string);
        registers = await storage.getDailyRegistersByDateRange(startDate, endDate);
      } else {
        registers = await storage.getDailyRegisters();
      }
      
      return res.status(200).json(registers);
    } catch (error) {
      console.error("Error fetching daily registers:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/daily-registers", async (req: Request, res: Response) => {
    try {
      const parsedData = insertDailyRegisterSchema.safeParse(req.body);
      
      if (!parsedData.success) {
        return res.status(400).json({ message: "Invalid daily register data", errors: parsedData.error });
      }
      
      const newRegister = await storage.createDailyRegister(parsedData.data);
      return res.status(201).json(newRegister);
    } catch (error) {
      console.error("Error creating daily register:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get dashboard data for register closing
  app.get("/api/register-summary", async (req: Request, res: Response) => {
    try {
      const systemBalance = await storage.getCurrentSystemBalance();
      const cashSales = await storage.getCashSalesTotal();
      const cardSales = await storage.getCardSalesTotal();
      const pixSales = await storage.getPixSalesTotal();
      const salesCount = await storage.getSalesCount();
      
      return res.status(200).json({
        systemBalance,
        cashSales,
        cardSales,
        pixSales,
        salesCount,
        totalSales: cashSales + cardSales + pixSales
      });
    } catch (error) {
      console.error("Error fetching register summary:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
