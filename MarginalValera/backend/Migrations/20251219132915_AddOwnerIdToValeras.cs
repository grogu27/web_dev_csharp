using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MarginalValera.Migrations
{
    /// <inheritdoc />
    public partial class AddOwnerIdToValeras : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OwnerId",
                table: "Valeras",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "Valeras");
        }
    }
}
