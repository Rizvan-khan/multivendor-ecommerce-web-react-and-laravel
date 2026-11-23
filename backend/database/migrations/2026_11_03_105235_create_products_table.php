<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained('users')->onDelete('cascade');
            // Aakhri wali sub-sub-category ki ID
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');

            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();

            $table->decimal('price', 10, 2);          // Original Price
            $table->decimal('sale_price', 10, 2)->nullable(); // Discounted Price (Optional)
            $table->integer('stock')->default(0);     // Quantity available
            $table->string('sku')->unique();          // Unique stock keeping unit

            // Status: pending (admin review ke liye), approved (live), rejected
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('approved');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
