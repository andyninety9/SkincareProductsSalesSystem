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

    public virtual DbSet<AnswerUser> AnswerUsers { get; set; }

    public virtual DbSet<Brand> Brands { get; set; }

    public virtual DbSet<CategoryProduct> CategoryProducts { get; set; }

    public virtual DbSet<CategoryQuestion> CategoryQuestions { get; set; }

    public virtual DbSet<Comment> Comments { get; set; }

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

    public virtual DbSet<Question> Questions { get; set; }

    public virtual DbSet<RatingProduct> RatingProducts { get; set; }

    public virtual DbSet<ResultSkinTest> ResultSkinTests { get; set; }

    public virtual DbSet<ReturnProduct> ReturnProducts { get; set; }

    public virtual DbSet<ReturnProductDetail> ReturnProductDetails { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<SkinType> SkinTypes { get; set; }

    public virtual DbSet<SkinTypeTest> SkinTypeTests { get; set; }

    public virtual DbSet<SkinTypeTestDetail> SkinTypeTestDetails { get; set; }

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

            entity.HasIndex(e => e.Username, "account_username_unique").IsUnique();

            entity.Property(e => e.AccId).HasColumnName("accID");
            entity.Property(e => e.AccStatusId)
                .HasMaxLength(255)
                .HasColumnName("accStatusID");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .HasDefaultValueSql("'255'::character varying")
                .HasColumnName("password");
            entity.Property(e => e.RoleId)
                .HasMaxLength(255)
                .HasColumnName("roleID");
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

            entity.Property(e => e.AccStatusId)
                .HasMaxLength(255)
                .HasColumnName("accStatusID");
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
            entity.Property(e => e.UsrId)
                .ValueGeneratedOnAdd()
                .HasColumnName("usrID");
            entity.Property(e => e.Ward)
                .HasMaxLength(255)
                .HasColumnName("ward");

            entity.HasOne(d => d.Usr).WithMany(p => p.Addresses)
                .HasForeignKey(d => d.UsrId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("address_usrid_foreign");
        });

        modelBuilder.Entity<AnswerUser>(entity =>
        {
            entity.HasKey(e => e.AndId).HasName("AnswerUser_pkey");

            entity.ToTable("AnswerUser");

            entity.Property(e => e.AndId).HasColumnName("andID");
            entity.Property(e => e.KeyId)
                .ValueGeneratedOnAdd()
                .HasColumnName("keyID");
            entity.Property(e => e.QuestionId)
                .ValueGeneratedOnAdd()
                .HasColumnName("questionID");

            entity.HasOne(d => d.Key).WithMany(p => p.AnswerUsers)
                .HasForeignKey(d => d.KeyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("answeruser_keyid_foreign");

            entity.HasOne(d => d.Question).WithMany(p => p.AnswerUsers)
                .HasForeignKey(d => d.QuestionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("answeruser_questionid_foreign");
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

        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(e => e.CommentId).HasName("Comment_pkey");

            entity.ToTable("Comment");

            entity.Property(e => e.CommentId).HasColumnName("commentID");
            entity.Property(e => e.CommentContent).HasColumnName("commentContent");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("createdAt");
            entity.Property(e => e.ProdId)
                .ValueGeneratedOnAdd()
                .HasColumnName("prodID");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("updatedAt");
            entity.Property(e => e.UsrId)
                .ValueGeneratedOnAdd()
                .HasColumnName("usrID");

            entity.HasOne(d => d.Prod).WithMany(p => p.Comments)
                .HasForeignKey(d => d.ProdId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("comment_prodid_foreign");
        });

        modelBuilder.Entity<DeliveryDetail>(entity =>
        {
            entity.HasKey(e => e.DeliId).HasName("DeliveryDetail_pkey");

            entity.ToTable("DeliveryDetail");

            entity.Property(e => e.DeliId)
                .ValueGeneratedNever()
                .HasColumnName("deliID");
            entity.Property(e => e.AddressId).HasColumnName("addressID");
            entity.Property(e => e.CreateAt)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("createAt");
            entity.Property(e => e.DeliPhoneNumber)
                .HasMaxLength(255)
                .HasColumnName("deliPhoneNumber");
            entity.Property(e => e.DeliServiceId).HasColumnName("deliServiceID");
            entity.Property(e => e.DeliStatus)
                .HasComment("Just manage 2 status: Success / False")
                .HasColumnName("deliStatus");
            entity.Property(e => e.OrdId).HasColumnName("ordID");

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

            entity.Property(e => e.DeliServiceId)
                .ValueGeneratedNever()
                .HasColumnName("DeliServiceID");
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

            entity.Property(e => e.EventId)
                .ValueGeneratedNever()
                .HasColumnName("eventID");
            entity.Property(e => e.DiscountPercent).HasColumnName("discountPercent");
            entity.Property(e => e.EndTime)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("endTime");
            entity.Property(e => e.EventDesc).HasColumnName("eventDesc");
            entity.Property(e => e.EventName).HasColumnName("eventName");
            entity.Property(e => e.StartTime)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("startTime");
        });

        modelBuilder.Entity<EventDetail>(entity =>
        {
            entity.HasKey(e => e.EventDetailId).HasName("EventDetail_pkey");

            entity.ToTable("EventDetail");

            entity.Property(e => e.EventDetailId)
                .ValueGeneratedNever()
                .HasColumnName("eventDetailID");
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
            entity.Property(e => e.CreateAt)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("createAt");
            entity.Property(e => e.EventId)
                .ValueGeneratedOnAdd()
                .HasColumnName("eventID");
            entity.Property(e => e.OrdDate)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("ordDate");
            entity.Property(e => e.OrdStatusId)
                .HasMaxLength(255)
                .HasColumnName("ordStatusID");
            entity.Property(e => e.TotalOrdPricr).HasColumnName("totalOrdPricr");
            entity.Property(e => e.UpdateAt)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("updateAt");
            entity.Property(e => e.UsrId)
                .ValueGeneratedOnAdd()
                .HasColumnName("usrID");

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

            entity.Property(e => e.OrdDetailId)
                .ValueGeneratedNever()
                .HasColumnName("ordDetailID");
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

            entity.Property(e => e.OrdLogId)
                .ValueGeneratedNever()
                .HasColumnName("ordLogID");
            entity.Property(e => e.CreateAt)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("createAt");
            entity.Property(e => e.NewStatusOrdId)
                .HasMaxLength(255)
                .HasColumnName("newStatusOrdID");
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
                .HasMaxLength(255)
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
            entity.Property(e => e.BrandId)
                .ValueGeneratedOnAdd()
                .HasColumnName("brandID");
            entity.Property(e => e.CateId)
                .ValueGeneratedOnAdd()
                .HasColumnName("cateID");
            entity.Property(e => e.CostPrice)
                .HasDefaultValueSql("'0'::double precision")
                .HasColumnName("costPrice");
            entity.Property(e => e.ProductDesc).HasColumnName("productDesc");
            entity.Property(e => e.ProductName)
                .HasMaxLength(255)
                .HasColumnName("productName");
            entity.Property(e => e.SellPrice)
                .HasDefaultValueSql("'0'::double precision")
                .HasColumnName("sellPrice");
            entity.Property(e => e.SkinTypeId)
                .ValueGeneratedOnAdd()
                .HasColumnName("skinTypeID");
            entity.Property(e => e.Stocks)
                .HasDefaultValue(0)
                .HasColumnName("stocks");
            entity.Property(e => e.TotalRating).HasColumnName("totalRating");
            entity.Property(e => e.UseFor)
                .HasMaxLength(255)
                .HasComment("Suitable for skin type...")
                .HasColumnName("useFor");

            entity.HasOne(d => d.Brand).WithMany(p => p.Products)
                .HasForeignKey(d => d.BrandId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("product_brandid_foreign");

            entity.HasOne(d => d.Cate).WithMany(p => p.Products)
                .HasForeignKey(d => d.CateId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("product_cateid_foreign");
        });

        modelBuilder.Entity<ProductImage>(entity =>
        {
            entity.HasKey(e => e.ProductImageId).HasName("ProductImage_pkey");

            entity.ToTable("ProductImage");

            entity.Property(e => e.ProductImageId).HasColumnName("productImageID");
            entity.Property(e => e.ProductId)
                .ValueGeneratedOnAdd()
                .HasColumnName("productID");
            entity.Property(e => e.ProductImageUrl)
                .HasMaxLength(255)
                .HasColumnName("productImageUrl");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductImages)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("productimage_productid_foreign");
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

        modelBuilder.Entity<RatingProduct>(entity =>
        {
            entity.HasKey(e => e.RatingProdId).HasName("RatingProduct_pkey");

            entity.ToTable("RatingProduct");

            entity.Property(e => e.RatingProdId).HasColumnName("ratingProdID");
            entity.Property(e => e.ProdId)
                .ValueGeneratedOnAdd()
                .HasColumnName("prodID");
            entity.Property(e => e.Rating).HasColumnName("rating");
            entity.Property(e => e.UsrId)
                .ValueGeneratedOnAdd()
                .HasColumnName("usrID");

            entity.HasOne(d => d.Prod).WithMany(p => p.RatingProducts)
                .HasForeignKey(d => d.ProdId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("ratingproduct_prodid_foreign");
        });

        modelBuilder.Entity<ResultSkinTest>(entity =>
        {
            entity.HasKey(e => e.ResultId).HasName("ResultSkinTest_pkey");

            entity.ToTable("ResultSkinTest");

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
            entity.Property(e => e.SkinTypeId)
                .ValueGeneratedOnAdd()
                .HasColumnName("skinTypeID");
            entity.Property(e => e.Srscore)
                .HasDefaultValueSql("'0'::smallint")
                .HasComment("SensitiveResistantScore")
                .HasColumnName("SRScore");
            entity.Property(e => e.TestId)
                .ValueGeneratedOnAdd()
                .HasColumnName("testID");
            entity.Property(e => e.UsrId)
                .ValueGeneratedOnAdd()
                .HasColumnName("usrID");
            entity.Property(e => e.Wtscore)
                .HasDefaultValueSql("'0'::smallint")
                .HasComment("WrinkledTightScore")
                .HasColumnName("WTScore");

            entity.HasOne(d => d.SkinType).WithMany(p => p.ResultSkinTests)
                .HasForeignKey(d => d.SkinTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("resultskintest_skintypeid_foreign");

            entity.HasOne(d => d.Test).WithMany(p => p.ResultSkinTests)
                .HasForeignKey(d => d.TestId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("resultskintest_testid_foreign");

            entity.HasOne(d => d.Usr).WithMany(p => p.ResultSkinTests)
                .HasForeignKey(d => d.UsrId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("resultskintest_usrid_foreign");
        });

        modelBuilder.Entity<ReturnProduct>(entity =>
        {
            entity.HasKey(e => e.ReturnId).HasName("ReturnProduct_pkey");

            entity.ToTable("ReturnProduct");

            entity.Property(e => e.ReturnId).HasColumnName("returnID");
            entity.Property(e => e.OrdId)
                .ValueGeneratedOnAdd()
                .HasColumnName("ordID");
            entity.Property(e => e.ReturnDate).HasColumnName("returnDate");
            entity.Property(e => e.UsrId)
                .ValueGeneratedOnAdd()
                .HasColumnName("usrID");

            entity.HasOne(d => d.Ord).WithMany(p => p.ReturnProducts)
                .HasForeignKey(d => d.OrdId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("returnproduct_ordid_foreign");

            entity.HasOne(d => d.Usr).WithMany(p => p.ReturnProducts)
                .HasForeignKey(d => d.UsrId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("returnproduct_usrid_foreign");
        });

        modelBuilder.Entity<ReturnProductDetail>(entity =>
        {
            entity.HasKey(e => e.ReturnProductDetailId).HasName("ReturnProductDetail_pkey");

            entity.ToTable("ReturnProductDetail");

            entity.Property(e => e.ReturnProductDetailId).HasColumnName("returnProductDetailID");
            entity.Property(e => e.ProdId)
                .ValueGeneratedOnAdd()
                .HasColumnName("prodID");
            entity.Property(e => e.ReturnId)
                .ValueGeneratedOnAdd()
                .HasColumnName("returnID");
            entity.Property(e => e.ReturnImgUrl)
                .HasMaxLength(255)
                .HasColumnName("returnImgUrl");
            entity.Property(e => e.ReturnQuantity).HasColumnName("returnQuantity");

            entity.HasOne(d => d.Prod).WithMany(p => p.ReturnProductDetails)
                .HasForeignKey(d => d.ProdId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("returnproductdetail_prodid_foreign");

            entity.HasOne(d => d.Return).WithMany(p => p.ReturnProductDetails)
                .HasForeignKey(d => d.ReturnId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("returnproductdetail_returnid_foreign");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("Role_pkey");

            entity.ToTable("Role");

            entity.Property(e => e.RoleId)
                .HasMaxLength(255)
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

        modelBuilder.Entity<SkinTypeTest>(entity =>
        {
            entity.HasKey(e => e.TestId).HasName("SkinTypeTest_pkey");

            entity.ToTable("SkinTypeTest");

            entity.Property(e => e.TestId).HasColumnName("testID");
            entity.Property(e => e.CreatedAt).HasColumnName("createdAt");
            entity.Property(e => e.CreatedByUsrId)
                .ValueGeneratedOnAdd()
                .HasColumnName("createdByUsrID");
            entity.Property(e => e.TestDesc).HasColumnName("testDesc");
            entity.Property(e => e.TestName)
                .HasMaxLength(255)
                .HasColumnName("testName");
        });

        modelBuilder.Entity<SkinTypeTestDetail>(entity =>
        {
            entity.HasKey(e => e.DetailId).HasName("SkinTypeTestDetail_pkey");

            entity.ToTable("SkinTypeTestDetail");

            entity.Property(e => e.DetailId)
                .ValueGeneratedNever()
                .HasColumnName("detailID");
            entity.Property(e => e.QuestionId)
                .ValueGeneratedOnAdd()
                .HasColumnName("questionID");
            entity.Property(e => e.TestId).HasColumnName("testID");

            entity.HasOne(d => d.Question).WithMany(p => p.SkinTypeTestDetails)
                .HasForeignKey(d => d.QuestionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("skintypetestdetail_questionid_foreign");

            entity.HasOne(d => d.Test).WithMany(p => p.SkinTypeTestDetails)
                .HasForeignKey(d => d.TestId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("skintypetestdetail_testid_foreign");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UsrId).HasName("User_pkey");

            entity.ToTable("User");

            entity.HasIndex(e => e.Email, "user_email_unique").IsUnique();

            entity.HasIndex(e => e.EmailVerifyToken, "user_emailverifytoken_unique").IsUnique();

            entity.HasIndex(e => e.ForgotPasswordToken, "user_forgotpasswordtoken_unique").IsUnique();

            entity.HasIndex(e => e.Phone, "user_phone_unique").IsUnique();

            entity.Property(e => e.UsrId)
                .ValueGeneratedOnAdd()
                .HasColumnName("usrID");
            entity.Property(e => e.AvatarUrl)
                .HasMaxLength(255)
                .HasColumnName("avatarUrl");
            entity.Property(e => e.CoverUrl)
                .HasMaxLength(255)
                .HasColumnName("coverUrl");
            entity.Property(e => e.CreateAt)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("createAt");
            entity.Property(e => e.Dob).HasColumnName("dob");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .HasColumnName("email");
            entity.Property(e => e.EmailVerifyToken)
                .HasMaxLength(255)
                .HasColumnName("emailVerifyToken");
            entity.Property(e => e.ForgotPasswordToken)
                .HasMaxLength(255)
                .HasColumnName("forgotPasswordToken");
            entity.Property(e => e.Fullname)
                .HasMaxLength(255)
                .HasColumnName("fullname");
            entity.Property(e => e.Gender)
                .HasMaxLength(255)
                .HasColumnName("gender");
            entity.Property(e => e.Phone)
                .HasMaxLength(255)
                .HasColumnName("phone");
            entity.Property(e => e.UpdateAt)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("updateAt");

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
            entity.Property(e => e.UsrId)
                .ValueGeneratedOnAdd()
                .HasColumnName("usrID");
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
            entity.Property(e => e.CreateAt)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("createAt");
            entity.Property(e => e.EndDate)
                .HasColumnType("timestamp(0) without time zone")
                .HasColumnName("endDate");
            entity.Property(e => e.OrdId)
                .ValueGeneratedOnAdd()
                .HasColumnName("ordID");

            entity.HasOne(d => d.Ord).WithMany(p => p.WarantyOrders)
                .HasForeignKey(d => d.OrdId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("warantyorder_ordid_foreign");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
