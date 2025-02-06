using System;
using System.Collections.Generic;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Context;

public partial class MyDbContext : DbContext
{
    public MyDbContext()
    {
    }

    public MyDbContext(DbContextOptions<MyDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Account> Accounts { get; set; }

    public virtual DbSet<AccountStatus> AccountStatuses { get; set; }

    public virtual DbSet<Address> Addresses { get; set; }

    public virtual DbSet<Brand> Brands { get; set; }

    public virtual DbSet<CategoryProduct> CategoryProducts { get; set; }

    public virtual DbSet<CategoryQuestion> CategoryQuestions { get; set; }

    public virtual DbSet<DeliveryDetail> DeliveryDetails { get; set; }

    public virtual DbSet<DeliveryService> DeliveryServices { get; set; }

    public virtual DbSet<Event> Events { get; set; }

    public virtual DbSet<EventDetail> EventDetails { get; set; }

    public virtual DbSet<KeyQuestion> KeyQuestions { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderDetail> OrderDetails { get; set; }

    public virtual DbSet<OrderLog> OrderLogs { get; set; }

    public virtual DbSet<OrderStatus> OrderStatuses { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductImage> ProductImages { get; set; }

    public virtual DbSet<ProductStatus> ProductStatuses { get; set; }

    public virtual DbSet<Question> Questions { get; set; }

    public virtual DbSet<Quiz> Quizzes { get; set; }

    public virtual DbSet<QuizDetail> QuizDetails { get; set; }

    public virtual DbSet<RecommendFor> RecommendFors { get; set; }

    public virtual DbSet<ResultDetail> ResultDetails { get; set; }

    public virtual DbSet<ResultQuiz> ResultQuizzes { get; set; }

    public virtual DbSet<ReturnProduct> ReturnProducts { get; set; }

    public virtual DbSet<ReturnProductDetail> ReturnProductDetails { get; set; }

    public virtual DbSet<Review> Reviews { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<SkinType> SkinTypes { get; set; }

    public virtual DbSet<TreatmentSolution> TreatmentSolutions { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Voucher> Vouchers { get; set; }

    public virtual DbSet<WarantyOrder> WarantyOrders { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql("Name=DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.AccId).HasName("Account_pkey");

            entity.ToTable("Account");

            entity.HasIndex(e => e.Username, "Account_username_key").IsUnique();

            entity.Property(e => e.AccId).HasColumnName("accID");
            entity.Property(e => e.AccStatusId).HasColumnName("accStatusID");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .HasDefaultValueSql("'255'::character varying")
                .HasColumnName("password");
            entity.Property(e => e.RoleId).HasColumnName("roleID");
            entity.Property(e => e.Username)
                .HasMaxLength(255)
                .HasColumnName("username");

            entity.HasOne(d => d.AccStatus).WithMany(p => p.Accounts)
                .HasForeignKey(d => d.AccStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("account_accstatusid_foreign");

            entity.HasOne(d => d.Role).WithMany(p => p.Accounts)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("account_roleid_foreign");
        });

        modelBuilder.Entity<AccountStatus>(entity =>
        {
            entity.HasKey(e => e.AccStatusId).HasName("AccountStatus_pkey");

            entity.ToTable("AccountStatus");

            entity.Property(e => e.AccStatusId).HasColumnName("accStatusID");
            entity.Property(e => e.StatusName)
                .HasMaxLength(255)
                .HasColumnName("statusName");
        });

        modelBuilder.Entity<Address>(entity =>
        {
            entity.HasKey(e => e.AddressId).HasName("Address_pkey");

            entity.ToTable("Address");

            entity.Property(e => e.AddressId).HasColumnName("addressID");
            entity.Property(e => e.AddDetail)
                .HasMaxLength(255)
                .HasColumnName("addDetail");
            entity.Property(e => e.City)
                .HasMaxLength(255)
                .HasColumnName("city");
            entity.Property(e => e.Country)
                .HasMaxLength(255)
                .HasColumnName("country");
            entity.Property(e => e.District)
                .HasMaxLength(255)
                .HasColumnName("district");
            entity.Property(e => e.IsDefault).HasColumnName("isDefault");
            entity.Property(e => e.UsrId).HasColumnName("usrID");
            entity.Property(e => e.Ward)
                .HasMaxLength(255)
                .HasColumnName("ward");

            entity.HasOne(d => d.Usr).WithMany(p => p.Addresses)
                .HasForeignKey(d => d.UsrId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("address_usrid_foreign");
        });

        modelBuilder.Entity<Brand>(entity =>
        {
            entity.HasKey(e => e.BrandId).HasName("Brand_pkey");

            entity.ToTable("Brand");

            entity.Property(e => e.BrandId).HasColumnName("brandID");
            entity.Property(e => e.BrandDesc).HasColumnName("brandDesc");
            entity.Property(e => e.BrandName)
                .HasMaxLength(255)
                .HasColumnName("brandName");
            entity.Property(e => e.BrandOrigin)
                .HasMaxLength(255)
                .HasColumnName("brandOrigin");
            entity.Property(e => e.BrandStatus).HasColumnName("brandStatus");
        });

        modelBuilder.Entity<CategoryProduct>(entity =>
        {
            entity.HasKey(e => e.CateProdId).HasName("CategoryProduct_pkey");

            entity.ToTable("CategoryProduct");

            entity.Property(e => e.CateProdId).HasColumnName("cateProdID");
            entity.Property(e => e.CateProdName)
                .HasMaxLength(255)
                .HasColumnName("cateProdName");
            entity.Property(e => e.CateProdStatus).HasColumnName("cateProdStatus");
        });

        modelBuilder.Entity<CategoryQuestion>(entity =>
        {
            entity.HasKey(e => e.CateQuestionId).HasName("CategoryQuestion_pkey");

            entity.ToTable("CategoryQuestion");

            entity.Property(e => e.CateQuestionId).HasColumnName("cateQuestionID");
            entity.Property(e => e.CateDesc).HasColumnName("cateDesc");
            entity.Property(e => e.CateName)
                .HasMaxLength(255)
                .HasColumnName("cateName");
            entity.Property(e => e.CreatedAt).HasColumnName("createdAt");
        });

        modelBuilder.Entity<DeliveryDetail>(entity =>
        {
            entity.HasKey(e => e.DeliId).HasName("DeliveryDetail_pkey");

            entity.ToTable("DeliveryDetail");

            entity.Property(e => e.DeliId).HasColumnName("deliID");
            entity.Property(e => e.AddressId).HasColumnName("addressID");
            entity.Property(e => e.CreateAt)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("createAt");
            entity.Property(e => e.DeliPhone)
                .HasMaxLength(255)
                .HasColumnName("deliPhone");
            entity.Property(e => e.DeliServiceId).HasColumnName("deliServiceID");
            entity.Property(e => e.DeliStatus)
                .HasComment("Just manage 2 status: Success / False")
                .HasColumnName("deliStatus");
            entity.Property(e => e.OrdId).HasColumnName("ordID");

            entity.HasOne(d => d.Address).WithMany(p => p.DeliveryDetails)
                .HasForeignKey(d => d.AddressId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("deliverydetail_addressid_foreign");

            entity.HasOne(d => d.DeliService).WithMany(p => p.DeliveryDetails)
                .HasForeignKey(d => d.DeliServiceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("deliverydetail_deliserviceid_foreign");

            entity.HasOne(d => d.Ord).WithMany(p => p.DeliveryDetails)
                .HasForeignKey(d => d.OrdId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("deliverydetail_ordid_foreign");
        });

        modelBuilder.Entity<DeliveryService>(entity =>
        {
            entity.HasKey(e => e.DeliServiceId).HasName("DeliveryService_pkey");

            entity.ToTable("DeliveryService");

            entity.Property(e => e.DeliServiceId).HasColumnName("DeliServiceID");
            entity.Property(e => e.ContactService)
                .HasMaxLength(255)
                .HasColumnName("contactService");
            entity.Property(e => e.DeliServiceName).HasMaxLength(255);
            entity.Property(e => e.DeliServiceStatus).HasColumnName("deliServiceStatus");
        });

        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.EventId).HasName("Event_pkey");

            entity.ToTable("Event");

            entity.Property(e => e.EventId).HasColumnName("eventID");
            entity.Property(e => e.DiscountPercent).HasColumnName("discountPercent");
            entity.Property(e => e.EndTime)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("endTime");
            entity.Property(e => e.EventDesc).HasColumnName("eventDesc");
            entity.Property(e => e.EventName)
                .HasMaxLength(255)
                .HasColumnName("eventName");
            entity.Property(e => e.StartTime)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("startTime");
            entity.Property(e => e.StatusEvent).HasColumnName("statusEvent");
        });

        modelBuilder.Entity<EventDetail>(entity =>
        {
            entity.HasKey(e => e.EventDetailId).HasName("EventDetail_pkey");

            entity.ToTable("EventDetail");

            entity.Property(e => e.EventDetailId).HasColumnName("eventDetailID");
            entity.Property(e => e.EventId).HasColumnName("eventID");
            entity.Property(e => e.ProductId).HasColumnName("productID");

            entity.HasOne(d => d.Event).WithMany(p => p.EventDetails)
                .HasForeignKey(d => d.EventId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("eventdetail_eventid_foreign");

            entity.HasOne(d => d.Product).WithMany(p => p.EventDetails)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("eventdetail_productid_foreign");
        });

        modelBuilder.Entity<KeyQuestion>(entity =>
        {
            entity.HasKey(e => e.KeyId).HasName("KeyQuestion_pkey");

            entity.ToTable("KeyQuestion");

            entity.Property(e => e.KeyId).HasColumnName("keyID");
            entity.Property(e => e.CreatedAt).HasColumnName("createdAt");
            entity.Property(e => e.KeyContent).HasColumnName("keyContent");
            entity.Property(e => e.KeyScore).HasColumnName("keyScore");
            entity.Property(e => e.QuestionId)
                .ValueGeneratedOnAdd()
                .HasColumnName("questionID");

            entity.HasOne(d => d.Question).WithMany(p => p.KeyQuestions)
                .HasForeignKey(d => d.QuestionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("keyquestion_questionid_foreign");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrdId).HasName("Order_pkey");

            entity.ToTable("Order");

            entity.Property(e => e.OrdId).HasColumnName("ordID");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("createdAt");
            entity.Property(e => e.EventId).HasColumnName("eventID");
            entity.Property(e => e.OrdDate)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("ordDate");
            entity.Property(e => e.OrdStatusId).HasColumnName("ordStatusID");
            entity.Property(e => e.TotalOrdPrice).HasColumnName("totalOrdPrice");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("updatedAt");
            entity.Property(e => e.UsrId).HasColumnName("usrID");

            entity.HasOne(d => d.Event).WithMany(p => p.Orders)
                .HasForeignKey(d => d.EventId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("order_eventid_foreign");

            entity.HasOne(d => d.OrdStatus).WithMany(p => p.Orders)
                .HasForeignKey(d => d.OrdStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("order_ordstatusid_foreign");

            entity.HasOne(d => d.Usr).WithMany(p => p.Orders)
                .HasForeignKey(d => d.UsrId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("order_usrid_foreign");
        });

        modelBuilder.Entity<OrderDetail>(entity =>
        {
            entity.HasKey(e => e.OrdDetailId).HasName("OrderDetail_pkey");

            entity.ToTable("OrderDetail");

            entity.Property(e => e.OrdDetailId).HasColumnName("ordDetailID");
            entity.Property(e => e.OrdId).HasColumnName("ordID");
            entity.Property(e => e.ProdId).HasColumnName("prodID");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.SellPrice).HasColumnName("sellPrice");

            entity.HasOne(d => d.Ord).WithMany(p => p.OrderDetails)
                .HasForeignKey(d => d.OrdId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("orderdetail_ordid_foreign");

            entity.HasOne(d => d.Prod).WithMany(p => p.OrderDetails)
                .HasForeignKey(d => d.ProdId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("orderdetail_prodid_foreign");
        });

        modelBuilder.Entity<OrderLog>(entity =>
        {
            entity.HasKey(e => e.OrdLogId).HasName("OrderLog_pkey");

            entity.ToTable("OrderLog");

            entity.Property(e => e.OrdLogId).HasColumnName("ordLogID");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("createdAt");
            entity.Property(e => e.NewStatusOrdId).HasColumnName("newStatusOrdID");
            entity.Property(e => e.Note).HasColumnName("note");
            entity.Property(e => e.OrdId).HasColumnName("ordID");
            entity.Property(e => e.UsrId).HasColumnName("usrID");

            entity.HasOne(d => d.NewStatusOrd).WithMany(p => p.OrderLogs)
                .HasForeignKey(d => d.NewStatusOrdId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("orderlog_newstatusordid_foreign");

            entity.HasOne(d => d.Ord).WithMany(p => p.OrderLogs)
                .HasForeignKey(d => d.OrdId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("orderlog_ordid_foreign");
        });

        modelBuilder.Entity<OrderStatus>(entity =>
        {
            entity.HasKey(e => e.OrdStatusId).HasName("OrderStatus_pkey");

            entity.ToTable("OrderStatus");

            entity.Property(e => e.OrdStatusId)
                .ValueGeneratedNever()
                .HasColumnName("ordStatusID");
            entity.Property(e => e.OrdStatusName)
                .HasMaxLength(255)
                .HasColumnName("ordStatusName");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductId).HasName("Product_pkey");

            entity.ToTable("Product");

            entity.Property(e => e.ProductId).HasColumnName("productID");
            entity.Property(e => e.BrandId).HasColumnName("brandID");
            entity.Property(e => e.CateId)
                .ValueGeneratedOnAdd()
                .HasColumnName("cateID");
            entity.Property(e => e.CostPrice)
                .HasDefaultValueSql("'0'::double precision")
                .HasColumnName("costPrice");
            entity.Property(e => e.Ingredient).HasColumnName("ingredient");
            entity.Property(e => e.Instruction).HasColumnName("instruction");
            entity.Property(e => e.ProdStatusId).HasColumnName("prodStatusID");
            entity.Property(e => e.ProductDesc).HasColumnName("productDesc");
            entity.Property(e => e.ProductName)
                .HasMaxLength(255)
                .HasColumnName("productName");
            entity.Property(e => e.SellPrice)
                .HasDefaultValueSql("'0'::double precision")
                .HasColumnName("sellPrice");
            entity.Property(e => e.Stocks)
                .HasDefaultValue(0)
                .HasColumnName("stocks");
            entity.Property(e => e.TotalRating).HasColumnName("totalRating");

            entity.HasOne(d => d.Brand).WithMany(p => p.Products)
                .HasForeignKey(d => d.BrandId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("product_brandid_foreign");

            entity.HasOne(d => d.Cate).WithMany(p => p.Products)
                .HasForeignKey(d => d.CateId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("product_cateid_foreign");

            entity.HasOne(d => d.ProdStatus).WithMany(p => p.Products)
                .HasForeignKey(d => d.ProdStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("product_prodstatusid_foreign");
        });

        modelBuilder.Entity<ProductImage>(entity =>
        {
            entity.HasKey(e => e.ProdImageId).HasName("ProductImage_pkey");

            entity.ToTable("ProductImage");

            entity.Property(e => e.ProdImageId).HasColumnName("prodImageID");
            entity.Property(e => e.ProdId).HasColumnName("prodID");
            entity.Property(e => e.ProdImageUrl)
                .HasMaxLength(255)
                .HasColumnName("prodImageUrl");

            entity.HasOne(d => d.Prod).WithMany(p => p.ProductImages)
                .HasForeignKey(d => d.ProdId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("productimage_prodid_foreign");
        });

        modelBuilder.Entity<ProductStatus>(entity =>
        {
            entity.HasKey(e => e.ProdStatusId).HasName("ProductStatus_pkey");

            entity.ToTable("ProductStatus");

            entity.Property(e => e.ProdStatusId).HasColumnName("prodStatusID");
            entity.Property(e => e.ProdStatusName)
                .HasMaxLength(255)
                .HasColumnName("prodStatusName");
        });

        modelBuilder.Entity<Question>(entity =>
        {
            entity.HasKey(e => e.QuestionId).HasName("Question_pkey");

            entity.ToTable("Question");

            entity.Property(e => e.QuestionId).HasColumnName("questionID");
            entity.Property(e => e.AnsId)
                .ValueGeneratedOnAdd()
                .HasColumnName("ansID");
            entity.Property(e => e.CateQuestionId)
                .ValueGeneratedOnAdd()
                .HasColumnName("cateQuestionID");
            entity.Property(e => e.CreatedAt).HasColumnName("createdAt");
            entity.Property(e => e.QuestionContent).HasColumnName("questionContent");

            entity.HasOne(d => d.CateQuestion).WithMany(p => p.Questions)
                .HasForeignKey(d => d.CateQuestionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("question_catequestionid_foreign");
        });

        modelBuilder.Entity<Quiz>(entity =>
        {
            entity.HasKey(e => e.QuizId).HasName("Quiz_pkey");

            entity.ToTable("Quiz");

            entity.Property(e => e.QuizId).HasColumnName("quizID");
            entity.Property(e => e.CreatedAt).HasColumnName("createdAt");
            entity.Property(e => e.QuizDesc).HasColumnName("quizDesc");
            entity.Property(e => e.QuizName)
                .HasMaxLength(255)
                .HasColumnName("quizName");
        });

        modelBuilder.Entity<QuizDetail>(entity =>
        {
            entity.HasKey(e => e.DetailId).HasName("QuizDetail_pkey");

            entity.ToTable("QuizDetail");

            entity.Property(e => e.DetailId)
                .ValueGeneratedNever()
                .HasColumnName("detailID");
            entity.Property(e => e.QuestId)
                .ValueGeneratedOnAdd()
                .HasColumnName("questID");
            entity.Property(e => e.QuizId).HasColumnName("quizID");

            entity.HasOne(d => d.Quest).WithMany(p => p.QuizDetails)
                .HasForeignKey(d => d.QuestId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("quizdetail_questid_foreign");

            entity.HasOne(d => d.Quiz).WithMany(p => p.QuizDetails)
                .HasForeignKey(d => d.QuizId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("quizdetail_quizid_foreign");
        });

        modelBuilder.Entity<RecommendFor>(entity =>
        {
            entity.HasKey(e => e.RecForId).HasName("RecommendFor_pkey");

            entity.ToTable("RecommendFor");

            entity.Property(e => e.RecForId).HasColumnName("recForID");
            entity.Property(e => e.ProdId).HasColumnName("prodID");
            entity.Property(e => e.SkinTypeId).HasColumnName("skinTypeID");

            entity.HasOne(d => d.Prod).WithMany(p => p.RecommendFors)
                .HasForeignKey(d => d.ProdId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("recommendfor_prodid_foreign");

            entity.HasOne(d => d.SkinType).WithMany(p => p.RecommendFors)
                .HasForeignKey(d => d.SkinTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("recommendfor_skintypeid_foreign");
        });

        modelBuilder.Entity<ResultDetail>(entity =>
        {
            entity.HasKey(e => e.ResultDetailId).HasName("ResultDetail_pkey");

            entity.ToTable("ResultDetail");

            entity.Property(e => e.ResultDetailId).HasColumnName("resultDetailID");
            entity.Property(e => e.KeyId).HasColumnName("keyID");
            entity.Property(e => e.ResultId).HasColumnName("resultID");

            entity.HasOne(d => d.Key).WithMany(p => p.ResultDetails)
                .HasForeignKey(d => d.KeyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("resultdetail_keyid_foreign");

            entity.HasOne(d => d.Result).WithMany(p => p.ResultDetails)
                .HasForeignKey(d => d.ResultId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("resultdetail_resultid_foreign");
        });

        modelBuilder.Entity<ResultQuiz>(entity =>
        {
            entity.HasKey(e => e.ResultId).HasName("ResultQuiz_pkey");

            entity.ToTable("ResultQuiz");

            entity.Property(e => e.ResultId).HasColumnName("resultID");
            entity.Property(e => e.CreateAt)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("createAt");
            entity.Property(e => e.IsDefault)
                .HasDefaultValue(true)
                .HasColumnName("isDefault");
            entity.Property(e => e.Odscore)
                .HasDefaultValueSql("'0'::smallint")
                .HasComment("OilyDryScore")
                .HasColumnName("ODScore");
            entity.Property(e => e.Pnpscore)
                .HasDefaultValueSql("'0'::smallint")
                .HasComment("PigmentedNonPigmentedScore")
                .HasColumnName("PNPScore");
            entity.Property(e => e.QuizId).HasColumnName("quizID");
            entity.Property(e => e.SkinTypeId)
                .ValueGeneratedOnAdd()
                .HasColumnName("skinTypeID");
            entity.Property(e => e.Srscore)
                .HasDefaultValueSql("'0'::smallint")
                .HasComment("SensitiveResistantScore")
                .HasColumnName("SRScore");
            entity.Property(e => e.UsrId).HasColumnName("usrID");
            entity.Property(e => e.Wtscore)
                .HasDefaultValueSql("'0'::smallint")
                .HasComment("WrinkledTightScore")
                .HasColumnName("WTScore");

            entity.HasOne(d => d.Quiz).WithMany(p => p.ResultQuizzes)
                .HasForeignKey(d => d.QuizId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("resultquiz_quizid_foreign");

            entity.HasOne(d => d.SkinType).WithMany(p => p.ResultQuizzes)
                .HasForeignKey(d => d.SkinTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("resultquiz_skintypeid_foreign");

            entity.HasOne(d => d.Usr).WithMany(p => p.ResultQuizzes)
                .HasForeignKey(d => d.UsrId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("resultquiz_usrid_foreign");
        });

        modelBuilder.Entity<ReturnProduct>(entity =>
        {
            entity.HasKey(e => e.ReturnId).HasName("ReturnProduct_pkey");

            entity.ToTable("ReturnProduct");

            entity.Property(e => e.ReturnId).HasColumnName("returnID");
            entity.Property(e => e.OrdIdd).HasColumnName("ordIDd");
            entity.Property(e => e.RefundAmount).HasColumnName("refundAmount");
            entity.Property(e => e.ReturnDate).HasColumnName("returnDate");
            entity.Property(e => e.ReturnStatus).HasColumnName("returnStatus");
            entity.Property(e => e.UsrId).HasColumnName("usrID");

            entity.HasOne(d => d.OrdIddNavigation).WithMany(p => p.ReturnProducts)
                .HasForeignKey(d => d.OrdIdd)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("returnproduct_ordidd_foreign");

            entity.HasOne(d => d.Usr).WithMany(p => p.ReturnProducts)
                .HasForeignKey(d => d.UsrId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("returnproduct_usrid_foreign");
        });

        modelBuilder.Entity<ReturnProductDetail>(entity =>
        {
            entity.HasKey(e => e.ReturnProdDetailId).HasName("ReturnProductDetail_pkey");

            entity.ToTable("ReturnProductDetail");

            entity.Property(e => e.ReturnProdDetailId).HasColumnName("returnProdDetailID");
            entity.Property(e => e.ProdIdre).HasColumnName("prodIDre");
            entity.Property(e => e.ReturnId).HasColumnName("returnID");
            entity.Property(e => e.ReturnImgUrl)
                .HasMaxLength(255)
                .HasColumnName("returnImgUrl");
            entity.Property(e => e.ReturnQuantity).HasColumnName("returnQuantity");

            entity.HasOne(d => d.ProdIdreNavigation).WithMany(p => p.ReturnProductDetails)
                .HasForeignKey(d => d.ProdIdre)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("returnproductdetail_prodidre_foreign");

            entity.HasOne(d => d.Return).WithMany(p => p.ReturnProductDetails)
                .HasForeignKey(d => d.ReturnId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("returnproductdetail_returnid_foreign");
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.ReviewId).HasName("Review_pkey");

            entity.ToTable("Review");

            entity.Property(e => e.ReviewId).HasColumnName("reviewID");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("createdAt");
            entity.Property(e => e.ProdId).HasColumnName("prodID");
            entity.Property(e => e.Rating).HasColumnName("rating");
            entity.Property(e => e.ReviewContent).HasColumnName("reviewContent");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("updatedAt");
            entity.Property(e => e.UsrId).HasColumnName("usrID");

            entity.HasOne(d => d.Prod).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.ProdId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("comment_prodid_foreign");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("Role_pkey");

            entity.ToTable("Role");

            entity.Property(e => e.RoleId)
                .ValueGeneratedNever()
                .HasColumnName("roleID");
            entity.Property(e => e.RoleName)
                .HasMaxLength(255)
                .HasColumnName("roleName");
            entity.Property(e => e.RoleStatus).HasColumnName("roleStatus");
        });

        modelBuilder.Entity<SkinType>(entity =>
        {
            entity.HasKey(e => e.SkinTypeId).HasName("SkinType_pkey");

            entity.ToTable("SkinType");

            entity.Property(e => e.SkinTypeId).HasColumnName("skinTypeID");
            entity.Property(e => e.SkinTypeCodes)
                .HasMaxLength(255)
                .HasComment("Mã loại da (ví dụ: \"OSPT\", \"DRNW\").")
                .HasColumnName("skinTypeCodes");
            entity.Property(e => e.SkinTypeDesc)
                .HasComment("Mô tả chi tiết về loại da.")
                .HasColumnName("skinTypeDesc");
            entity.Property(e => e.SkinTypeName)
                .HasMaxLength(255)
                .HasComment("Tên loại da đầy đủ (ví dụ: \"Oily, Sensitive, Pigmented, Tight\").")
                .HasColumnName("skinTypeName");
        });

        modelBuilder.Entity<TreatmentSolution>(entity =>
        {
            entity.HasKey(e => e.SolutionId).HasName("TreatmentSolution_pkey");

            entity.ToTable("TreatmentSolution");

            entity.Property(e => e.SolutionId).HasColumnName("solutionID");
            entity.Property(e => e.SkinTypeId).HasColumnName("skinTypeID");
            entity.Property(e => e.SolutionContent).HasColumnName("solutionContent");

            entity.HasOne(d => d.SkinType).WithMany(p => p.TreatmentSolutions)
                .HasForeignKey(d => d.SkinTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("treatmentsolution_skintypeid_foreign");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UsrId).HasName("User_pkey");

            entity.ToTable("User");

            entity.HasIndex(e => e.EmailVerifyToken, "User_emailVerifyToken_key").IsUnique();

            entity.HasIndex(e => e.Email, "User_email_key").IsUnique();

            entity.HasIndex(e => e.ForgotPasswordToken, "User_forgotPasswordToken_key").IsUnique();

            entity.HasIndex(e => e.Phone, "User_phone_key").IsUnique();

            entity.Property(e => e.UsrId)
                .ValueGeneratedOnAdd()
                .HasColumnName("usrID");
            entity.Property(e => e.AvatarUrl)
                .HasMaxLength(255)
                .HasColumnName("avatarUrl");
            entity.Property(e => e.CoverUrl)
                .HasMaxLength(255)
                .HasColumnName("coverUrl");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("createdAt");
            entity.Property(e => e.Dob).HasColumnName("dob");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .HasColumnName("email");
            entity.Property(e => e.EmailVerifyToken)
                .HasMaxLength(500)
                .HasColumnName("emailVerifyToken");
            entity.Property(e => e.ForgotPasswordToken)
                .HasMaxLength(500)
                .HasColumnName("forgotPasswordToken");
            entity.Property(e => e.Fullname)
                .HasMaxLength(255)
                .HasColumnName("fullname");
            entity.Property(e => e.Gender).HasColumnName("gender");
            entity.Property(e => e.Phone)
                .HasMaxLength(255)
                .HasColumnName("phone");
            entity.Property(e => e.RewardPoint)
                .HasDefaultValueSql("'0'::smallint")
                .HasComment("0-250: Bronze rank\n250-1500: Silver rank\nOver 1500: Gold rank")
                .HasColumnName("rewardPoint");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("updatedAt");

            entity.HasOne(d => d.Usr).WithOne(p => p.User)
                .HasForeignKey<User>(d => d.UsrId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("user_usrid_foreign");
        });

        modelBuilder.Entity<Voucher>(entity =>
        {
            entity.HasKey(e => e.VoucherId).HasName("Voucher_pkey");

            entity.ToTable("Voucher");

            entity.Property(e => e.VoucherId).HasColumnName("voucherID");
            entity.Property(e => e.UsrId).HasColumnName("usrID");
            entity.Property(e => e.VoucherDesc).HasColumnName("voucherDesc");
            entity.Property(e => e.VoucherDiscount).HasColumnName("voucherDiscount");

            entity.HasOne(d => d.Usr).WithMany(p => p.Vouchers)
                .HasForeignKey(d => d.UsrId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("voucher_usrid_foreign");
        });

        modelBuilder.Entity<WarantyOrder>(entity =>
        {
            entity.HasKey(e => e.WarantyId).HasName("WarantyOrder_pkey");

            entity.ToTable("WarantyOrder");

            entity.Property(e => e.WarantyId).HasColumnName("warantyID");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("createdAt");
            entity.Property(e => e.EndDate)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("endDate");
            entity.Property(e => e.OrdId).HasColumnName("ordID");

            entity.HasOne(d => d.Ord).WithMany(p => p.WarantyOrders)
                .HasForeignKey(d => d.OrdId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("warantyorder_ordid_foreign");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
