#!/bin/bash

# Directories to fix
DIRS=("contexts" "components" "lib" "hooks" "utils" "context")

# Function to fix imports in a file
fix_file() {
    local file=$1
    local depth=$(echo "$file" | tr -cd '/' | wc -c)
    # src/app is depth 2 (e.g. src/app/page.js)
    # src/app/about is depth 3 (e.g. src/app/about/page.js)
    
    # Base depth for src/app is 2
    local relative_depth=$((depth - 2))
    
    for dir in "${DIRS[@]}"; do
        if [ $relative_depth -eq 0 ]; then
            # Already handled manually for src/app/page.js, but for completeness:
            sed -i '' "s|'\./$dir/|'../$dir/|g" "$file"
            sed -i '' "s|\"./$dir/|\"../$dir/|g" "$file"
        elif [ $relative_depth -eq 1 ]; then
            # e.g. src/app/about/page.js (depth 3)
            # Original: ../contexts/ -> New: ../../contexts/
            sed -i '' "s|'\.\./$dir/|'../../$dir/|g" "$file"
            sed -i '' "s|\"\.\./$dir/|\"../../$dir/|g" "$file"
            sed -i '' "s|'\.\./$dir'|'../../$dir'|g" "$file"
            sed -i '' "s|\"\.\./$dir\"|\"../../$dir\"|g" "$file"
        elif [ $relative_depth -eq 2 ]; then
            # e.g. src/app/blog/[id]/page.js (depth 4)
            sed -i '' "s|'\.\./\.\./$dir/|'../../../$dir/|g" "$file"
            sed -i '' "s|\"\.\./\.\./$dir/|\"../../../$dir/|g" "$file"
        fi
    done
}

export -f fix_file
export DIRS

find src/app -name "*.js" -not -path "src/app/page.js" -not -path "src/app/layout.js" | while read file; do
    fix_file "$file"
done
