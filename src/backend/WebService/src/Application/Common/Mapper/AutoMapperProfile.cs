using System;
using System.Linq;
using AutoMapper;
using Application.Features.Users.Response;
using Application.Features.Products.Response;
using Domain.Entities;
using Domain.DTOs;
using Application.Features.Orders.Response;
using Application.Features.Question.Commands;
using Application.Features.ProductCategory.Queries.Response;
using Application.Features.SkinTypes.Queries.Response;
using Application.Features.Address.Queries.Response;
using Application.Features.Question.Queries.Response;
using Application.Features.Products.Commands.Response;
using Application.Features.Brands.Queries.Response;
using Application.Features.Brands.Commands.Response;
using Application.Features.Reviews.Commands.Response;
using Application.Features.Events.Commands.Response;

namespace Application.Common.Mapper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Mapping cho User
            CreateMap<GetMeResponse, User>();
            CreateMap<User, GetMeResponse>();
            CreateMap<User, GetAllUsersResponse>();
            CreateMap<GetAllUsersResponse, User>();
            CreateMap<Event, GetAllEventsResponse>();
            CreateMap<GetAllEventsResponse, Event>();
            CreateMap<Payment, PaymentDto>();
            CreateMap<PaymentDto, Payment>();
            CreateMap<Question, CreateQuestionCommand>();
            CreateMap<CreateQuestionCommand, Question>();
            CreateMap<Question, UpdateQuestionCommand>();
            CreateMap<UpdateQuestionCommand, Question>();
            CreateMap<GetAllProductCategoryResponse, CategoryProduct>();
            CreateMap<CategoryProduct, GetAllProductCategoryResponse>();
            CreateMap<SkinType, GetAllSkinTypesResponse>();
            CreateMap<GetAllSkinTypesResponse, SkinType>();
            CreateMap<KeyQuestionResponse, KeyQuestion>();
            CreateMap<KeyQuestion, KeyQuestionResponse>();            
            CreateMap<GetAllQuestionResponse, Question>();         
            CreateMap<Question, GetAllQuestionResponse>();   
            CreateMap<CreateNewProductResponse, Product>();   
            CreateMap<Product, CreateNewProductResponse>();   
            CreateMap<Brand, GetAllProductBrandResponse>();
            CreateMap<GetAllProductBrandResponse, Brand>();
            CreateMap<DeleteProductResponse, Product>();
            CreateMap<Product, DeleteProductResponse>();
            CreateMap<Brand, CreateProductBrandResponse>();
            CreateMap<CreateProductBrandResponse, Brand>();
            CreateMap<Review, CreateReviewResponse>();
            CreateMap<CreateReviewResponse, Review>();
            CreateMap<Event, CreateEventResponse>();
            CreateMap<CreateEventResponse, Event>();

            // Mapping for Order
            CreateMap<Order, ChangeOrderStatusResponse>();
            CreateMap<ChangeOrderStatusResponse, Order>();

            // Mapping for Address
            CreateMap<Address, GetAllUserAddressResponse>();
            CreateMap<GetAllUserAddressResponse, Address>();

            

            CreateMap<User, GetAllUsersResponse>()
                .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => src.Usr.Role.RoleId))
                .ForMember(dest => dest.StatusId, opt => opt.MapFrom(src => src.Usr.AccStatusId))
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.Usr.Username))
                .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => MapGender(src.Gender)))
                .ForMember(dest => dest.Dob, opt => opt.MapFrom(src => src.Dob.HasValue ? src.Dob.Value.ToDateTime(TimeOnly.MinValue) : (DateTime?)null))
                .ForMember(dest => dest.RewardRank, opt => opt.MapFrom(src => MapRewardRank(src.RewardPoint)));

            // Mapping cho Product với đầy đủ thông tin liên quan
            CreateMap<Product, GetAllProductsResponse>()
                .ForMember(dest => dest.BrandName, opt => opt.MapFrom(src => src.Brand.BrandName))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Cate.CateProdName))
                .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.ProdStatus.ProdStatusName))
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.ProductImages.Select(i => new ProductImageDto
                {
                    ProdImageId = i.ProdImageId,
                    ProdImageUrl = i.ProdImageUrl
                }).ToList()))
                .ForMember(dest => dest.ReviewCount, opt => opt.MapFrom(src => src.Reviews.Count()));

            CreateMap<GetAllProductsResponse, Product>();

            // Mapping cho ProductImage nếu cần
            CreateMap<ProductImage, string>().ConvertUsing(src => src.ProdImageUrl);
            CreateMap<ProductImage, ProductImageDto>()
            .ForMember(dest => dest.ProdImageUrl, opt => opt.MapFrom(src => src.ProdImageUrl))
            .ForMember(dest => dest.ProdImageId, opt => opt.MapFrom(src => src.ProdImageId))
            .ReverseMap();
            CreateMap<ProductImageDto, ProductImage>()
            .ForMember(dest => dest.ProdImageUrl, opt => opt.MapFrom(src => src.ProdImageUrl))
            .ForMember(dest => dest.ProdImageId, opt => opt.MapFrom(src => src.ProdImageId))
            .ReverseMap();

            CreateMap<Product, GetProductResponse>()
                .ForMember(dest => dest.BrandName, opt => opt.MapFrom(src => src.Brand.BrandName))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Cate.CateProdName))
                .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.ProdStatus.ProdStatusName))
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.ProductImages.Select(i => i.ProdImageUrl).ToList()))
                .ForMember(dest => dest.ReviewCount, opt => opt.MapFrom(src => src.Totalreview));
            // Mapping cho Review
            CreateMap<Review, GetAllProductReviewsResponse>()
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.UsrId));

        }

        private static string MapGender(short? gender)
        {
            return gender switch
            {
                1 => "Male",
                2 => "Female",
                _ => "Other"
            };
        }

        private static string MapRewardRank(short rewardPoint)
        {
            return rewardPoint switch
            {
                < 250 => "Bronze",
                >= 250 and < 1500 => "Silver",
                _ => "Gold"
            };
        }
    }
}
